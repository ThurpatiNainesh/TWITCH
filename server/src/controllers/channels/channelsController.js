import Channel from "../../models/Channel.js";
import User from "../../models/User.js";
import axios from "axios";

export const getChannelDetails = async (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId);

    if (!channel || !channel.isActive) {
      return res.status(404).send("Channel not found");
    }
  
    const user = await User.findOne({ channel: channelId }, { username: 1 });

    const requestData = await axios.get("http://localhost:8000/api/streams");
    const activeStreams = requestData.data;

    let liveStreams = [];

    for (const streamId in activeStreams?.live) {
      if (
        activeStreams.live[streamId].publisher &&
        activeStreams.live[streamId].publisher !== null
      ) {
        liveStreams.push(streamId);
      }
    }
    const isOnline = liveStreams.includes(channel.streamkey);

    return res.status(200).json({
      id: channel._id,
      title: channel.title,
      description: channel.description,
      username: user.username,
      isOnline,
      streamUrl: `http://localhost:8000/live/${channel.streamkey}.flv`,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send("Channel not found. Please check you channel url");
  }
};

export const getChannels = async (_, res) => {
  try {
    const users = await User.find(
      {},
      {
        channel: 1,
        username: 1,
      }
    ).populate("channel");
    // console.log(users)
    const requestData = await axios.get("http://localhost:8000/api/streams");
    const activeStreams = requestData.data;

    let liveStreams = [];

    for (const streamId in activeStreams?.live) {
      if (
        activeStreams.live[streamId].publisher &&
        activeStreams.live[streamId].publisher !== null
      ) {
        liveStreams.push(streamId);
      }
    }

    const channels = users
      .filter((u) => u.channel.isActive)
      .map((user) => {
        return {
          id: user.channel._id,
          title: user.channel.title,
          avatarUrl: user.channel.avatarUrl,
          username: user.username,
          isOnline: liveStreams.includes(user.channel.streamkey),
        };
      });
      console.log(channels)
    return res.json({
      channels,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json("Something went wrong");
  }
};

export const postFollowChannel = async (req, res) => {
  try {
    const { userId } = req.user;
    const { channelId } = req.body;

    const userData = await User.findById(userId, { followedChannels: 1 });

    if (userData.followedChannels.includes(channelId)) {
      return res.status(400).send("You are already following this channel");
    }
    userData.followedChannels.push(channelId);

    await userData.save();

    return res.status(500).json("Channel followed successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
};

export const getFollowedChannel = async (req, res) => {
  try {
    const { userId } = req.user;

    const { followedChannels } = await User.findById(userId, {
      followedChannels: 1,
    });

    return res.status(200).json({
      followedChannels,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Error occured while fetching followed channels");
  }
};
