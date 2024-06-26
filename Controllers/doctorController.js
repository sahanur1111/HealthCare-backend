import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

//======== update Doctor==========
export const updateDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    // console.log(updatedDoctor);

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "failed to update Doctor" });
  }
};

// =======delete Doctor ==========
export const deleteDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    await Doctor.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Doctor not deleted" });
  }
};

// =======get single Doctor ==========

export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const doctor = await Doctor.findById(id)
      .populate("reviews")
      .select("-password");
    res.status(200).json({
      success: true,
      message: "Doctor found successfully",
      data: doctor,
    });
  } catch (err) {
    res
      .status(404)
      .json({ success: false, message: "Doctor not found", data: err });
  }
};

//   ====get all Doctors =========
export const getAllDoctors = async (req, res) => {
  try {
    const { query } = req.query;
    let doctors;

    if (query) {
      doctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      doctors = await Doctor.find({ isApproved: "approved" }).select(
        "-password"
      );
    }
    // const doctors = await Doctor.find({}).select("-password"); // password is not shown because of security reasons.(select("-password")) use for.
    res.status(200).json({
      success: true,
      message: "Doctors found successfully",
      data: doctors,
    });
  } catch (err) {
    res
      .status(404)
      .json({ success: false, message: "Doctors not found", data: err });
  }
};

// ======get doctor profile =========

export const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId;

  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const { password, ...rest } = doctor._doc;
    const appointments = await Booking.find({ doctor: doctorId });
    res.status(200).json({
      success: true,
      message: "Doctor found successfully",
      data: { ...rest, appointments },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "something went wrong" });
  }
};
