<%--
  Created by IntelliJ IDEA.
  User: lt167
  Date: 4/30/2019
  Time: 2:42 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
    <title>Title</title>
</head>
<body>
    <b>Result: </b> <br>
    <c:if test="${pass eq checkValidEmail}">
        <b>Login success</b>
    </c:if>
    <c:if test="${pass ne checkValidEmail}">
        <b>Login failed</b>
    </c:if>
</body>
</html>