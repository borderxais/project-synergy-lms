const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const dotenv = require('dotenv');

dotenv.config();

// Configure Passport for Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.VITE_API_URL}/api/auth/google/callback`
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      // Handle user data from Google
      const user = {
        auth_provider: 'google',
        auth_provider_id: profile.id,
        email: profile.emails[0].value,
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        profile_image: profile.photos[0]?.value
      };
      return cb(null, user);
    } catch (error) {
      return cb(error, null);
    }
  }
));

// Configure Passport for Apple Sign In
passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,
    callbackURL: "/api/auth/apple/callback"
  },
  async function(req, accessToken, refreshToken, profile, cb) {
    try {
      // Handle user data from Apple
      const user = {
        auth_provider: 'apple',
        auth_provider_id: profile.id,
        email: profile.email,
        // Note: Apple only provides name on first login
        first_name: profile.name?.firstName || '',
        last_name: profile.name?.lastName || '',
      };
      return cb(null, user);
    } catch (error) {
      return cb(error, null);
    }
  }
));

module.exports = passport;
