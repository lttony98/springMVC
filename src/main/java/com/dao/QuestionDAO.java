package com.dao;

import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository(value = "questionDAO")
@Transactional(rollbackOn = Exception.class)
public class QuestionDAO {

//	@Autowired
//	private SessionFactory sessionFactory;

}
