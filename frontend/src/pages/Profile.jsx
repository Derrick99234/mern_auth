import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInFailure,
  signInSucess,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSucess,
  signOut,
} from "../redux/user/userSlice";

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const [file, setFile] = useState(undefined);
  const [imageProgress, setImageProgress] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const token = localStorage.getItem("token");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const hanldeDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `http://localhost:3000/api/user/delete/${currentUser.user._id}`,
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.error) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSucess(data));
    } catch (e) {
      dispatch(deleteUserFailure(e));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(
        `http://localhost:3000/api/user/update/${currentUser.user._id}`,
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          method: "POST",
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      console.log("clicked");
      const data = await res.json();
      if (data.error) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSucess(data));
      setUpdateSuccess(true);
    } catch (e) {
      dispatch(signInFailure(e));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/signout");
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.user.email}
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-4">
        <span
          onClick={hanldeDeleteAccount}
          className="text-red-700 cursor-pointer"
        >
          Delete acct
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">
        {error ? error.message || "Something went wrong!" : " "}
      </p>
      <p className="text-green-700 mt-5">
        {updateSuccess && "User data is updated successfully!"}
      </p>
    </div>
  );
}

export default Profile;
