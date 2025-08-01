// Services
import { addMessage, getMessagesFromTo } from "../services/message.service.js";

// Response handler
import { success, error } from "../utils/responseHandlers.js";

// Utils
import { uploadImage } from "../utils/uploadImage.js";


// Send message
export const sendMessage = async (req, res) => {
  const { text, image } = req.body;
  const { id: receiver_id } = req.params;
  const sender_id = req.user.id;

  let imageUrl = null;

  if (image) {
    const uploadResult = await uploadImage(image);

    if (!uploadResult.success) {
      return error(res, uploadResult.error, 400);
    }

    imageUrl = uploadResult.url;
  }

  const { data, error: err } = await addMessage(
    { text, image: imageUrl, sender_id, receiver_id }
  );

  
  if (err || data.length === 0) {
    return error(res, 'Failed to send message. Server error');
  }

  return success(res, data[0], 201);
};


// Get messages by senderid and receiverid
export const getMessages = async (req, res) => {
  const receiver_id = req.params.receiver_id;
  const sender_id = req.user.id;

  if(!receiver_id){
    return error(res, 'Receiver ID required', 400);
  }
  if(!sender_id){
    return error(res, 'Sender ID required', 400);
  }

  const { data, error: err } = await getMessagesFromTo(sender_id, receiver_id);

  if(err){
    return error(res, err.message, 400);
  } else {
    return success(res, data);
  }
}