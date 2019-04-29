package com.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Locale;

@Controller
public class HomepageController {
    @RequestMapping(method = RequestMethod.GET, value = {"/", "/home"})
    public String homepage() {
        return "homepage";
    }

    @RequestMapping(method = RequestMethod.GET, value = "/chat")
    public String chat(Locale locale, Model model, HttpServletRequest req, HttpServletResponse res) {
        res.addCookie(new Cookie("sessionId", req.getSession().getId()));
        return "chat";
    }

}

