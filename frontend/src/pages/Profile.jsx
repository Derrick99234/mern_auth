import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [imageProgress, setImageProgress] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(formData);
  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const fileRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(fileRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageProgress(Math.round(progress));
      },
      (error) => {
        setImageError(true);
        if (imageError) {
          console.log(error);
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profileIMG: downloadURL });
        });
      }
    );
  };
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={formData.profileIMG || currentUser.user.profileIMG}
          alt="profile picture"
          onClick={() => fileRef.current.click()}
          className="w-24 h-24 self-center cursor-pointer rounded-full object-cover mt-2"
        />
        <p className="text-center">
          {imageError ? (
            <span className="text-red-700">
              Error uploading image (file size must be less taht 2MB)
            </span>
          ) : imageProgress > 0 && imageProgress < 100 ? (
            <span className="text-slate-700">{`Uploading: ${imageProgress}%`}</span>
          ) : imageProgress === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : (
            " "
          )}
        </p>
        <input
          type="file"
          ref={fileRef}
          accept="image/.*"
          hidden
          onChange={(e) => setFile(e.target.files[0])}
        />
        <input
          type="text"
          id="username"
          defaultValue={currentUser.user.username}
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3"
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.user.email}
          className="bg-slate-100 rounded-lg p-3"
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-4">
        <span className="text-red-700 cursor-pointer">Delete acct</span>
        <span className="text-red-700 cursor-pointer">sign out</span>
      </div>
    </div>
  );
}

export default Profile;
