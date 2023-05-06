const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { promisify } = require("util");

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: '90d',
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOption = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
    };
    
    res.cookie("jwt", token, cookieOption);
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};

exports.signup = async (req, res) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
        });
        createSendToken(newUser, 201, res);
    } catch (err) {
        res.status(400).json({mess: err.message});
    }
};

exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {
             res.status(400).json({"mess": "Please provide email ans password!"});
        }

        // 2) Check if user exist ans password is correct
        const user = await User.findOne({ email }).select("+password");
        console.log(user);
        if (!user || !(await user.correctPassword(password, user.password))) {
            res.status(400).json({ "mess": "Incorrect Email or Password" });
        }

        // 3) If everything ok, send token to client
        createSendToken(user, 200, res);
    } catch (err) {
        res.status(400).json({mess: err.message});
    }

};

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        // httpOnly: true
    })
    res.status(200).json({ status: 'success' });
}

exports.protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } 
    // else if (req.cookies.jwt) {
    //     token = req.cookies.jwt;
    // }

    if (!token) {
        return res.status(401).json({ mess: "You are not logged in! Please login to get access" });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return res.status(401).json({ mess: "The user belonging to this token does no longer exist." });
    }
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
};
