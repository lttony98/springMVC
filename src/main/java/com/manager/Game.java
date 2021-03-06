package com.manager;

import com.config.BeanUtil;
import com.dao.QuestionCollectionDAO;
import com.entities.Question;
import com.entities.QuestionCollection;
import com.model.WsMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;

import java.util.*;

public class Game implements Comparable<Game> {

	@Autowired
	public SimpMessageSendingOperations msg = BeanUtil.getBean(SimpMessageSendingOperations.class);

	@Autowired
	public QuestionCollectionDAO questionCollectionDAO = BeanUtil.getBean(QuestionCollectionDAO.class);

	private QuestionCollection questionCollection;
	private Iterator<Question> questionsIterator;
	private Question currentQuestion;

	public static final Integer SUBMITTED_ERROR_CODE = -2;
	public static final String PLAYER_EXISTED = "Player is existed!";
	public static final String GAME_STARTED = "Game is already started!";
	public static final String OK = "OK";
	public static final String GAME_END = "GAME_END";
	private static final String TOPIC_PREFIX = "/game/";
	private static final String HOST_TOPIC_POSTFIX = "/host";
	private String gameWsTopic;

	private Integer PIN;
	private boolean is_began = false;
	private long began_question_time = 0;
	private ArrayList<Player> submittedPlayers = new ArrayList<>();
	private Integer[] submittedCount = new Integer[4];
	private HashMap<String, Player> players = new HashMap<>();

	public Game(Integer questionCollectionId) {
        int generatedPIN = GameManager.getInstance().generatePIN();
        if (generatedPIN <= GameManager.MAX_GAME_COUNT) { // out of Game slot
            this.PIN = generatedPIN;
            this.gameWsTopic = TOPIC_PREFIX + this.PIN;
            // Load Questions
            if (questionCollectionId >= 0) {
                QuestionCollection questionCollectionX = questionCollectionDAO.getQuestionCollectionById(questionCollectionId);
                if (questionCollectionX != null)
                    this.questionCollection = questionCollectionX;
                this.gameWsTopic = TOPIC_PREFIX + this.PIN;
            }
        }
    }

	public String join(String sessionId, String nickname) {
//		Collections.sort(players);
		Player newPlayer = new Player(sessionId, nickname);
		if (players.containsKey(sessionId))
			return PLAYER_EXISTED;
		if (is_began)
			return GAME_STARTED;

		List oldPlayersList = new ArrayList<>(Arrays.asList(players.values().toArray()));
		players.put(newPlayer.getSessionId(), newPlayer);
		System.out.println("[GAME #" + PIN + "] " + newPlayer +" joined!");
		WsMessage playersList = new WsMessage();
		playersList.setType(WsMessage.WsMessageType.NEW_PLAYER);
		oldPlayersList.add(newPlayer);
		playersList.setContent(oldPlayersList.toArray());
		sendMsg2Host(playersList);
		return OK;
	}

	public String startGame() {
		// Broadcast notice begin game
		if (is_began == false) {
			is_began = true;
			questionsIterator = getQuestionCollection().getQuestions().iterator();
		}
		return nextQuestion();
	}

//	private ObjectMapper objectMapper = new ObjectMapper();
	public String nextQuestion() {
		// Broadcast notice next question
		if (questionsIterator.hasNext()) {
			submittedPlayers.clear();
			for (int i = 0; i < 4; i++)
				submittedCount[i] = 0;
			WsMessage nextQuestionCommand = new WsMessage();
			WsMessage questionDetailForHost = new WsMessage();
			currentQuestion = questionsIterator.next();
			nextQuestionCommand.setType(WsMessage.WsMessageType.NEXT_QUESTION);
			nextQuestionCommand.setContent(String.valueOf(currentQuestion.getId()));
			questionDetailForHost.setType(WsMessage.WsMessageType.NEXT_QUESTION);
			questionDetailForHost.setContent(currentQuestion);
			broadcastMsg(nextQuestionCommand);
			sendMsg2Host(questionDetailForHost);
			began_question_time = System.currentTimeMillis();
			return OK;
		} else {    // NO MORE QUESTIONS
			return endGame();
		}
	}

	public String endGame() {
		// Broadcast notice end game
		WsMessage endCommand = new WsMessage();
		endCommand.setType(WsMessage.WsMessageType.END_GAME);
		broadcastMsg(endCommand);
		endCommand.setContent(players.values().toArray());
		sendMsg2Host(endCommand);
		return GAME_END;
	}

	private boolean broadcastMsg(Object msg2broadcast) {
		try {
			msg.convertAndSend(gameWsTopic, msg2broadcast);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public int validateAnswerAndGetScore(String sessionId, int questionId, int chooseAnswerId) {
		if (players.containsKey(sessionId)) {
			if (questionId == currentQuestion.getId()) {
				Player player = players.get(sessionId);
				if (submittedPlayers.contains(player))
					return SUBMITTED_ERROR_CODE;
				submittedPlayers.add(player);
				submittedCount[chooseAnswerId-1]++;
				if (chooseAnswerId == currentQuestion.getCorrectAnswer()) { // CORRECT ANSWER
					long time2Answer = System.currentTimeMillis() - began_question_time;
					float bonusTimePercentage = Math.min(Math.abs(1.0f - (float)time2Answer/(currentQuestion.getTime()*1000f)), 1.0f);
					return player.correctThisQuestion(bonusTimePercentage); // get score
				} else
					return player.wrongThisQuestion();
			}
		}
		return -1;
	}

	public Integer[] endQuestion(Integer currentQuestionId) {
		if (currentQuestionId != currentQuestion.getId())
			return null;
		WsMessage endQuestionMsg = new WsMessage();
		endQuestionMsg.setType(WsMessage.WsMessageType.END_QUESTION);
		broadcastMsg(endQuestionMsg);
		endQuestionMsg.setContent(submittedCount);
		sendMsg2Host(endQuestionMsg);
		return submittedCount;
	}

	public boolean checkAllPlayerSubmitted(Integer currentQuestionId) {
		int submittedPlayersCount = submittedPlayers.size();
		if (submittedPlayersCount == players.size()) { // All player submitted
			endQuestion(currentQuestionId);
			return true;
		}
		return false;
	}

	private boolean sendMsg2Host(Object msg2host) {
		try {
			msg.convertAndSend(gameWsTopic + HOST_TOPIC_POSTFIX, msg2host);
			return true;
		} catch (Exception e) {
			System.err.println("[sendMsg2Host]" + e.getMessage());
			return false;
		}
	}

	public Integer getPIN() { return PIN; }
	public void setPIN(Integer PIN) { this.PIN = PIN; }

	public Question getCurrentQuestion() { return currentQuestion; }

	public QuestionCollection getQuestionCollection() { return questionCollection; }
//	public void setQuestionCollection(QuestionCollection questionCollection) { this.questionCollection = questionCollection; }

	@Override
	public int compareTo(Game o) {
		return this.PIN.compareTo(o.PIN);
	}

	@Override
	public  String toString() {
		return "Game: {gamePIN: " + PIN +", is_began: " + is_began + ", #players: " + players.size() + ", questionCollection: " + this.questionCollection + "}";
	}

}
