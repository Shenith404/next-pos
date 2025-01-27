import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const packageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
});

export const emailValidationSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

export const confrimOtpSchema = z.object({
  otp: z.string().min(1, "OTP is required"),
});

export const resetPwSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmpassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  username: z.string().min(1, "UserName if required"),
});

export const changePwSchema = z.object({
  oldPassword: z.string().min(8, "Password must be at least 8 characters"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const inputGalleryImageSchema = z.object({
  title: z.string().min(1, "Please add a title"),
  description: z.string().min(1, "Please add a description"),
});

export const defaultSchema = z.object({}).passthrough();
export const posSearchSchema = z.object({

    searchTerm: z.string().nonempty("Search term is required"),

    category: z.string().nonempty("Category is required"),

});