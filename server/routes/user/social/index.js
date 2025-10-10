import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/api/user/failure` }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, `${process.env.JWT_SECRET}`, { expiresIn: '7d' });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24
    });
    res.redirect(`${process.env.CLIENT_URL}`);
  }
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: `${process.env.CLIENT_URL}/api/user/failure` }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, `${process.env.JWT_SECRET}`, { expiresIn: '7d' });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24
    });
    res.redirect(`${process.env.CLIENT_URL}`);
  }
);

router.get('/failure', (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/CreateAccount/?Failed_Logging_In`);
});

export default router;