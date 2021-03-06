package com.rest;

import com.manager.Game;
import com.manager.GameManager;
import com.model.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/1.0/game")
public class GameAPIController {

	@GetMapping
	public String greetingToGameAPI() {
		return "Welcome to GAME APIs!";
	}

	@PostMapping(value = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
	public ApiResponse createNewGame(@RequestParam int questionCollectionId, HttpServletRequest req, HttpServletResponse res) {
		ApiResponse createResponse = new ApiResponse();
		Integer createdGamePIN = GameManager.getInstance().createNewGame(questionCollectionId);
		if (createdGamePIN > 0) {
			createResponse.setType(ApiResponse.ApiResponseType.GAME_CREATED);
			createResponse.setContent(createdGamePIN);
			res.setStatus(HttpServletResponse.SC_CREATED);
		} else {
			createResponse.setType(ApiResponse.ApiResponseType.REQUEST_ERROR);
			createResponse.setContent(createdGamePIN);
			res.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
		}
		return createResponse;
	}

	@PostMapping(value = "/join", produces = MediaType.APPLICATION_JSON_VALUE)
	public ApiResponse joinGame(@RequestParam int gamePIN, @RequestParam String nickname, HttpServletRequest req, HttpServletResponse res) {
		ApiResponse joinResponse = new ApiResponse();
		String joined = GameManager.getInstance().joinGame(req.getSession().getId(), gamePIN, nickname);
		if (joined != null && joined.equals(Game.OK)) {
			joinResponse.setType(ApiResponse.ApiResponseType.JOIN_ACCEPTED);
			joinResponse.setContent(gamePIN);
			res.setStatus(HttpServletResponse.SC_ACCEPTED);
		} else {
			joinResponse.setType(ApiResponse.ApiResponseType.JOIN_DENIED);
			joinResponse.setContent(joined);
			res.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
		}
		return joinResponse;
	}

	@PostMapping(value = "/start", produces = MediaType.APPLICATION_JSON_VALUE)
	public ApiResponse startGame(@RequestParam int gamePIN, HttpServletRequest req, HttpServletResponse res) {
		ApiResponse startGameResponse = new ApiResponse();
		Game game = GameManager.getInstance().getGameByPIN(gamePIN);
		if (game == null) {
			startGameResponse.setType(ApiResponse.ApiResponseType.REQUEST_ERROR);
			startGameResponse.setContent("DOES NOT FOUND GAME!");
			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return startGameResponse;
		}
		String startGameStatus = game.startGame();
		if (startGameStatus.equals(Game.OK)) {
			startGameResponse.setType(ApiResponse.ApiResponseType.GAME_STARTED);
		} else {
			startGameResponse.setType(ApiResponse.ApiResponseType.REQUEST_ERROR);
			startGameResponse.setContent(startGameStatus);
			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		}
		return startGameResponse;
	}

	@PostMapping(value = "/next", produces = MediaType.APPLICATION_JSON_VALUE)
	public ApiResponse nextQuestion(@RequestParam int gamePIN, HttpServletRequest req, HttpServletResponse res) {
		ApiResponse nextQuestionResponse = new ApiResponse();
		Game game = GameManager.getInstance().getGameByPIN(gamePIN);
		if (game != null) {
			String nextQuestion = game.nextQuestion();
			if (nextQuestion.equals(Game.OK)) {
				nextQuestionResponse.setType(ApiResponse.ApiResponseType.OK);
			} else if (nextQuestion.equals(Game.GAME_END)) {
				nextQuestionResponse.setType(ApiResponse.ApiResponseType.OK);
				nextQuestionResponse.setContent(Game.GAME_END);
			} else {
				nextQuestionResponse.setType(ApiResponse.ApiResponseType.REQUEST_ERROR);
				nextQuestionResponse.setContent(nextQuestion);
				res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			}
			return nextQuestionResponse;
		}
		res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		return null;
	}

	@PostMapping(value = "/submit", produces = MediaType.APPLICATION_JSON_VALUE)
	public ApiResponse submitAnswer(@RequestParam int gamePIN, @RequestParam int questionId, @RequestParam int chooseAnswerId, HttpServletRequest req, HttpServletResponse res) {
		ApiResponse submittedResponse = new ApiResponse();
		Game game = GameManager.getInstance().getGameByPIN(gamePIN);
		if (game != null) {
			int score = game.validateAnswerAndGetScore(req.getSession().getId(), questionId, chooseAnswerId);
			game.checkAllPlayerSubmitted(questionId);
			if (score >= 0) {
				submittedResponse.setType(ApiResponse.ApiResponseType.SUBMIT_ACCEPTED);
				submittedResponse.setContent(score);
				res.setStatus(HttpServletResponse.SC_ACCEPTED);
				return submittedResponse;
			}
		}
		res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		return null;
	}

	@PostMapping(value = "/endquestion", produces = MediaType.APPLICATION_JSON_VALUE)
	public ApiResponse endQuestion(@RequestParam int gamePIN, @RequestParam int questionId, HttpServletRequest req, HttpServletResponse res) {
		ApiResponse endQuestionResponse = new ApiResponse();
		Game game = GameManager.getInstance().getGameByPIN(gamePIN);
		if (game != null) {
			Integer[] submittedCount = game.endQuestion(questionId);
			if (submittedCount != null) {
				endQuestionResponse.setType(ApiResponse.ApiResponseType.OK);
//				endQuestionResponse.setContent(submittedCount);
				res.setStatus(HttpServletResponse.SC_OK);
			}
		}
		res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		return null;
	}

	@PostMapping(value = "/remove", produces = MediaType.APPLICATION_JSON_VALUE)
	public ApiResponse removeGame(@RequestParam int gamePIN, HttpServletRequest req, HttpServletResponse res) {
		ApiResponse removeResponse = new ApiResponse();
		boolean removed = GameManager.getInstance().removeGame(gamePIN);
		if (removed) {
			removeResponse.setType(ApiResponse.ApiResponseType.GAME_REMOVED);
			removeResponse.setContent(Game.OK);
		} else {
			removeResponse.setType(ApiResponse.ApiResponseType.REQUEST_ERROR);
			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		}
		return removeResponse;
	}


	@Autowired
	public SimpMessageSendingOperations messagingTemplate;

}
