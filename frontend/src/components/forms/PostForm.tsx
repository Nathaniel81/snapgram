import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

import { INewPost } from "../../types";
import { useToast } from "../ui/use-toast";
import axios from 'axios';
import { useState, useRef } from "react";
import Loader from "../shared/Loader";
import { PostValidation } from "../../lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";


type PostFormProps = {
  post?: INewPost;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>();
  const fileInput = useRef<HTMLInputElement>(null);
  
  const form = useForm({
    defaultValues: {
      caption: post ? post.caption : "",
      location: "",
      tags: ""
    },
    resolver: zodResolver(PostValidation),
  });
  const { formState: { errors } } = form;
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  console.log('Selected File: ', selectedFile);


  const handleSubmit = form.handleSubmit(async (values) => {
    setIsLoadingCreate(true);
    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
    }
  
    formData.append('caption', values.caption);
    formData.append('location', values.location);
    formData.append('tags', values.tags);
  
    try {
      const { data } = await axios.post('/api/post/create/', formData);
      console.log(data);
    } catch (error) {
      console.log(error);
      toast({
        title: `${action} post failed. Please try again.`,
      });
    }
    setIsLoadingCreate(false);
    navigate("/");
  });
  

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
      setSelectedFile(files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="flex flex-col gap-9 w-full max-w-5xl"
    >
      <div>
        <label className="shad-form_label">Caption</label>
        <div className="py-5">
          <Textarea
            className="shad-textarea custom-scrollbar"
            {...form.register("caption")}
          />
        </div>
        {errors.caption && <div className="shad-form_message">{errors.caption.message}</div>}
      </div>
      <div className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer">
        <input 
          type="file"
          ref={fileInput}
          hidden
          accept=".png,.jpeg,.jpg" 
          onChange={handleFileChange} 
          className="cursor-pointer" />

        {fileUrl ? (
          <>
            <div className="flex flex-1 justify-center w-full p-5 lg:p-10" onClick={handleClick}>
              <img src={fileUrl} alt="image" className="file_uploader-img" />
            </div>
            <p className="file_uploader-label">Click photo to replace</p>
          </>
        ) : (
          <div className="file_uploader-box ">
            <img
              src="/assets/icons/file-upload.svg"
              width={96}
              height={77}
              alt="file upload"
            />

            <h3 className="base-medium text-light-2 mb-2 mt-6">
            </h3>
            <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

            <Button type="button" onClick={handleClick} className="shad-button_dark_4">
              Select from computer
            </Button>
          </div>
        )}
      </div>

      <div>
        <label className="shad-form_label">Add Location</label>
        <div className="py-5">
          <Input type="text" className="shad-input" {...form.register("location")} />
        </div>
        {errors.caption && <div className="shad-form_message">{errors.caption.message}</div>}
      </div>

      <div>
        <label className="shad-form_label">Add Tags (separated by comma " , ")</label>
        <div className="py-5">
          <Input type="text" className="shad-input" {...form.register("tags")} />
        </div>
        {errors.caption && <div className="shad-form_message">{errors.caption.message}</div>}
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
          disabled={isLoadingCreate}>
          {(isLoadingCreate) && <Loader />}
          {action} Post
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
