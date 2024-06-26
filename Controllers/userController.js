import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

//======== update user==========
export const updateUSer = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "User not updated" });
  }
};

// =======delete user ==========
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "User not deleted" });
  }
};

// =======get single user ==========

export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    res.status(200).json({
      success: true,
      message: "user found successfully",
      data: user,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "user not found" });
  }
};

//   ====get all users =========
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}) // password is not shown because of security reasons.(select("-password")) use for.
    res.status(200).json({
      success: true,
      message: "users found successfully",
      data: users,
    });
  } catch (err) {
    res
      .status(404)
      .json({ success: false, message: "users not found" });
  }
};

// ======get user profile =========
export const getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    const { password, ...rest } = user.toObject(); // Use toObject() to convert the Mongoose document to a plain JavaScript object.
    res.status(200).json({
      success: true,
      message: "user found successfully",
      data: { ...rest },
    });
  } catch (err) {
    console.error('Error in getUserProfile:', err);
    res.status(500).json({ success: false, message: "something went wrong" });
  }
};

// ======get my appointments =========

export const getMyAppointments = async (req, res) => {
  try {
    // step 1 : retrive appointments from booking for specific user
    const bookings = await Booking.find({ user: req.userId });

    // step 2 : extract doctor ids from appointments bookings.
    const doctorIds = bookings.map(el=>el.doctor.id);

    // step 3 : retrive doctors using  doctor ids
    const doctors = await Doctor.find({_id: {$in: doctorIds}}).select('-password');

    res.status(200).json({
      success: true,
      message: "appointments found successfully",
      data: doctors,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "something went wrong" });
  }
};
