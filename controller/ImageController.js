const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const fs = require("fs");
const prisma = new PrismaClient();
const { createClient } = require("@supabase/supabase-js");
const { findUser } = require("../utils/finduser");
const getExtension = (img) => {
  const parts = img.split(".");
  const extension = parts[parts.length - 1];
  return extension;
};

async function storeIndb({ path }, mobile_number) {
  const user = await findUser(mobile_number);
  await prisma.users.update({
    where: {
      id: user?.id,
    },
    data: {
      profile_picture: path,
    },
  });
}

async function uploadImageToSupabase(buffer, extension, imageFilename) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
    const { data, error } = await supabase.storage
      .from("images")
      .upload(`profilepictures/${imageFilename}`, buffer.buffer, {
        contentType: `image/${extension}`,
        cacheControl: "15780000", //6 months
      });
    if (error) {
      console.log("error", error);
    } else {
      data.path = `${process.env.SUPABASE_URL_PREFIX}/${data.path}`;
      return data;
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}
const uploadImage = async (req, res, next) => {
  try {
    const selectedImage = req?.files;
    const { mobile_number } = req?.body;
    let uploadedImages = [];
    let extension = getExtension(selectedImage?.[0]?.originalname);
    await uploadImageToSupabase(
      selectedImage[0].buffer,
      extension,
      selectedImage[0].originalname
    )
      .then((data) => {
        uploadedImages.push(data);
        storeIndb(data, mobile_number);
      })
      .catch((err) => {
        console.log(err);
      });
    return res.status(200).json({ url: uploadedImages });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  uploadImage,
};
