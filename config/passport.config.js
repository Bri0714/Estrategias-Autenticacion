import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { userModel } from "../dao/models/users.model.js";
import { createHash, isValidPassword, generateToken, extractCookie } from "../utils.js";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from "dotenv";

dotenv.config();

const LocalStrategy = local.Strategy;
const GithubStrategy = GitHubStrategy.Strategy;

const initializePassport = () => {
    // Registro de usuario
    passport.use("register", new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: "email",
        },
        async (req, username, password, done) => {
            // Código del registro del usuario...
        },
    ));

    // Local Strategy
    passport.use("login", new LocalStrategy(
        { usernameField: "email" },
        async (username, password, done) => {
            // Código del inicio de sesión...
        },
    ));

    // Github Strategy
    passport.use("github", new GithubStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:8080/githubcallback",
            scope: ["user:email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            // Código de la estrategia de Github...
        },
    ));

    passport.use('jwt', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]), //donde leer el token
        secretOrKey: process.env.JWT_PRIVATE_KEY
    }, async (jwt_payload, done) => {
        done(null, jwt_payload)
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    });
};

export default initializePassport;