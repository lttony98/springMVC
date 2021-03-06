<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <title>Sign Up</title>
    <link rel="stylesheet" href="resources/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=ABeeZee">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Allerta">
    <link rel="stylesheet" href="resources/css/signup.css">
    <link rel="icon" href="resources/icon/favicon.png">
</head>

<body>
<div class="register-photo" style="width: auto;height: 1080px;padding: 40px 10px 10px;">
    <div class="form-container" style="width: 100%;height: 70%;">
        <form method="post" action="/signup" name="regisform" onsubmit="return checkValid()">
            <h2 class="text-center" style="font-size: 50px;font-family: Allerta, sans-serif;color: rgb(80,94,108);padding: 10px 0px 0px;margin: 0px 0px 10px;"><strong>Hello</strong></h2>
            <p class="text-center" style="margin: 0px 0px 50px;font-family: ABeeZee, sans-serif;font-size: 15px;"><strong>Sign up by entering the details below</strong></p>
            <div class="form-group"><input class="form-control" type="email" name="email" placeholder="Email" required></div>
            <div class="form-group"><input class="form-control" type="text" name="nickname" placeholder="Nickname" required></div>
            <div class="form-group"><input class="form-control" type="password" name="password" placeholder="Password" required></div>
            <div class="form-group"><input class="form-control" type="password" name="repassword" placeholder="Re-enter password" required></div>
            <div class="form-group">
                <div class="form-check" style="font-family: ABeeZee, sans-serif;"><label class="form-check-label"><input class="form-check-input" type="checkbox" required>I agree to the license terms.</label></div>
            </div>
            <div class="form-group"><button class="btn btn-primary btn-block" type="submit" style="background-image: linear-gradient(to right top, #08aeea, #00bdea, #00cae2, #00d6d3, #00e0be);margin: 25px 0px 0px;">Sign Up</button></div><a href="login" class="already" style="font-family: ABeeZee, sans-serif;">You already have an account? <span style="text-decoration: underline;">Login here</span></a></form>
        <div
                class="image-holder" style="background-image: url(&quot;resources/img/sign%20up.png&quot;);width: auto;height: auto;margin: 0;background-position: center;"></div>
    </div>
</div>

</html>
<%--    THIS SECTION FOR LEE TUAN ONLY, VALIDATE FORM --%>
<script>
    function checkValid() {
        var password = document.regisform.password.value;
        var repassword = document.regisform.repassword.value;
        if (password != repassword) {
            alert("Please enter the same password");
            return false;
        } else
            return true;
    }
</script>

</body>

</html>