import Channel from "../../models/Channel.js";
import User from "../../models/User.js";
import bcrypt from "bcrypt";

export const getChannelSettings = async (req, res) => {
  try {
    const { userId } = req.user;

    const userData = await User.findById(userId, {
      channel: 1,
      username: 1,
    }).populate("channel");
    
    return res.status(200).json({
      id: userData.channel._id,
      title: userData.channel.title,
      description: userData.channel.description,
      avatarUrl: userData.channel.avatarUrl,
      username: userData.username,
      streamkey: userData.channel.streamkey,
    });
  } catch (error) {
    res.status(500).json("Something went wrong");
  }
};

export const updateChannelSettings = async (req, res) => {
  try {
    const { userId } = req.user;

    const { title, description, avatarUrl, username } = req.body;

    const userData = await User.findById(userId, { username: 1, channel: 1 });

    if (userData.username !== username) {
      await User.updateOne({ _id: userId }, { username }, { new: true });
    }

    const channelData = await Channel.findByIdAndUpdate(
      userData.channel,
      {
        title,
        description,
        avatarUrl,
        isActive: true,
      },
      { new: true }
    );

    return res.status(200).json({
      channelId: channelData._id,
      username,
      title: channelData.title,
      description: channelData.description,
      avatarUrl: channelData.avatarUrl,
    });
  } catch (error) {
    res.status(500).json("Something went wrong");
  }
};

export const updatePasswordChannelSettings = async (req, res) => {
  try {
    const { userId } = req.user;
    const { password, newPassword } = req.body;

    const userData = await User.findById(userId, { password: 1 });

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res
        .status(200)
        .json({ message: " Invalid password. Please try again" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.updateOne(
      { _id: userId },
      { password: hashedPassword },
      { new: true }
    );

   return  res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error)
    res.status(500).json("Something went wrong");
  }
};
