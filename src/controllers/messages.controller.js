// Services
import { addMessage } from "../services/message.service.js";

// Response handler
import { success, error } from "../utils/responseHandlers.js";

// Utils
import { uploadImage } from "../utils/uploadImage.js";


// Send message
export const sendMessage = async (req, res) => {
  const { text, image } = req.body;
  const { id: receiver_id } = req.params;
  const sender_id = req.userId;

  let imageUrl = null;

  if (image) {
    const uploadResult = await uploadImage(image);

    if (!uploadResult.success) {
      return error(res, uploadResult.error, 400); // <-- use the returned message
    }

    imageUrl = uploadResult.url;
  }

  const { data, error: err } = await addMessage([{ sender_id, receiver_id, text, image: imageUrl }]);

  if (err || !data || data.length === 0) {
    return error(res, 'Failed to send message. Server error');
  }

  return success(res, data[0], 201);
};