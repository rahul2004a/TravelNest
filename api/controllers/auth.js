import User from '../models/User.js';
import bcrypt from "bcryptjs";

export const register = async (req, res, next) => {

    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            country: req.body.country,
            city: req.body.city,
            phone: req.body.phone,

        });
        await newUser.save();
        res.status(201).json("User has been registered");
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {

    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return next(createError(404, "User not found"));

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordCorrect)
            return next(createError(400, "Wrong password or username!"));

        const { password, isAdmin, ...otherDetails } = user._doc;
        res.status(201).json({ ...otherDetails });
    } catch (error) {
        next(error);
    }
}