import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";
import Loader from "../../components/shared/Loader";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../hooks/useToast";

import axios from 'axios';
import { ProfileValidation } from "../../lib/validation";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { RootState } from "../../redux/rootReducer";
import { updateUser } from "../../redux/slices/authSlice";


const UpdateProfile = () => {
  const userLogin = useSelector((state: RootState) => state.user);
  const { 
      userInfo: user, 
    } = userLogin;
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [fileUrl, setFileUrl] = useState<string>(user?.profile_picture ?? '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      name: user?.name,
      username: user?.username,
      email: user?.email,
      bio: user?.bio || "",
    },
  });

  const { formState: { errors }} = form;

  // Queries
  if (!user)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  const handleClick = () => {
    fileInput?.current?.click();
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFileUrl(URL.createObjectURL(file));
    }
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('File selected');
      setSelectedFile(files[0]);
    } else {
      setSelectedFile(null);
    }
  };
  console.log(selectedFile)
  const handleUpdate = form.handleSubmit(async (values) => {
    console.log(selectedFile)
    setIsLoadingUpdate(true);
    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
    }
  
    formData.append('name', values.name);
    formData.append('username', values.username);
    formData.append('email', values.email);
    formData.append('bio', values.bio);

    try {
      const { data } = await axios.patch(`/api/user/update/`, formData);
      dispatch(updateUser(data));
    } catch (error) {
      console.log(error);
      toast({
        title: `Update failed. Please try again.`,
      });
    }
  
    setIsLoadingUpdate(false);
    navigate(`/profile/${id}`);
  });

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

          <form
            onSubmit={(e) => handleUpdate(e)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
            <div>
            <input 
              type="file"
              ref={fileInput}
              hidden
              accept=".png,.jpeg,.jpg" 
              onChange={handleFileChange} 
              className="cursor-pointer" />
              <div className="cursor-pointer flex-start gap-4 py-5" onClick={handleClick}>
                <img
                  src={fileUrl || "/assets/icons/profile-placeholder.svg"}
                  alt="image"
                  className="h-24 w-24 rounded-full object-cover object-top"
                />
                <p className="text-primary-500 small-regular md:bbase-semibold">
                  Change profile photo
                </p>
              </div>
            </div>

            <div>
              <label className="shad-form_label">Name</label>
              <div className="py-5">
                <Input
                  className="shad-input"
                  {...form.register("name")}
                />
              </div>
              {errors.name && <div className="shad-form_message">{errors.name.message}</div>}
            </div>

            <div>
              <label className="shad-form_label">Username</label>
              <div className="py-5">
                <Input
                  className="shad-input"
                  {...form.register("username")}
                />
              </div>
              {errors.username && <div className="shad-form_message">{errors.username.message}</div>}
            </div>

            <div>
              <label className="shad-form_label">Email</label>
              <div className="py-5">
                <Input
                  className="shad-input"
                  {...form.register("email")}
                />
              </div>
              {errors.email && <div className="shad-form_message">{errors.email.message}</div>}
            </div>

            <div>
              <label className="shad-form_label">Bio</label>
              <div className="py-5">
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...form.register("bio")}
                />
              </div>
              {errors.bio && <div className="shad-form_message">{errors.bio.message}</div>}
            </div>

            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="shad-button_dark_4"
                onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                disabled={isLoadingUpdate}>
                {isLoadingUpdate && <Loader />}
                Update Profile
              </Button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
