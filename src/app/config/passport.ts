/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import bcryptjs from "bcryptjs";
import { envVars } from "./env";
import { Users } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";


passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        async (email: string, password: string, done) => {
            try {
                const user = await Users.findOne({ email });

                if (!user) {
                    return done(null, false, {message: "User Does Not Exist!"});
                    // return done("User Does Not Exist!")  //Alternative
                };

                const isGoogleAuthenticated = user.auths.some(providerObjects => providerObjects.provider === "google");
                if (isGoogleAuthenticated && !user.password) {
                    return done(
                        null,
                        false,
                        { message: "You have authenticated with Google previously! If you want to enable Credentials login, first login with Google with this gmail and set a password for your account." }
                    );
                    // Alternative
                    // return done("You have authenticated with Google previously! If you want to enable Credentials login, first login with Google with this gmail and set a password for your account.")
                };

                const isPasswordMatched = await bcryptjs.compare(password as string, user.password as string);

                if (!isPasswordMatched) {
                    return done(null, false, { message: "Incorrect Password!" });
                };

                return done(null, user);
            } catch (error) {
                console.log(error);
                done(error);
            }
        }
    )
)

passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL
        },
        async (token: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                const email = profile.emails?.[0].value;
                
                if (!email) {
                    return done(null, false, {message: "No Email Found"});
                };

                let user = await Users.findOne({email});

                if (!user) {
                    user = await Users.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0].value,
                        role: Role.USER,
                        isVerified: true,
                        auths: [
                            {
                                provider: "google",
                                providerId: profile.id
                            }
                        ]
                    });
                } else {
                    const isLocalAuthenticated = user.auths.some(providerObjects => providerObjects.provider === "credentials");
                    const isGoogleAuthenticated = user.auths.some(providerObjects => providerObjects.provider === "google");
                    if (isLocalAuthenticated && !isGoogleAuthenticated) {
                        user.auths.push({provider: "google", providerId: profile.id});
                        await user.save();
                    };
                };

                return done(null, user);
            } catch (error) {
                console.log("Google Strategy Error", error);
                return done(error);
            }
        }
    )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await Users.findById(id);
        done(null, user);
    } catch (error) {
        console.log(error);
        done(error);
    }
});