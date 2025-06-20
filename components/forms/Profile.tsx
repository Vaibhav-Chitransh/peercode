/* eslint-disable tailwindcss/classnames-order */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Suspense, useState } from "react";
import { Button } from "../ui/button";
import { ProfileSchema } from "@/lib/validations";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.action";
import ProfileVerificationDialog from "./ProfileVerificationDialog";
import TrashIcon from "../../assets/icons/trash.svg";
import Image from "next/image";

interface Props {
  clerkId: string;
  user: string;
}

const Profile = ({ clerkId, user }: Props) => {
  const parsedUser = JSON.parse(user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const pathname = usePathname();

  // 1. Define your form.
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: parsedUser.name || "",
      username: parsedUser.username || "",
      portfolioWebsite: parsedUser.portfolioWebsite || "",
      location: parsedUser.location || "",
      bio: parsedUser.bio || "",
      leetcodeId: parsedUser.leetcodeId || "",
      codeforcesId: parsedUser.codeforcesId || "",
      githubId: parsedUser.githubId || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    setIsSubmitting(true);

    try {
      await updateUser({
        clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          portfolioWebsite: values.portfolioWebsite,
          location: values.location,
          bio: values.bio,
          leetcodeId: values.leetcodeId,
          codeforcesId: values.codeforcesId,
          githubId: values.githubId,
        },
        path: pathname ?? "",
      });
      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDelete = async (platform: string) => {
    await updateUser({
      clerkId,
      updateData: {
        [`${platform}Verified`]: false,
      },
      path: "",
    });
  };

  return (
    <Suspense fallback={<div>Loading Profile Form...</div>}>
      <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full mt-9 gap-9"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3.5 text-dark100_light900">
              <FormLabel>
                Name<span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border placeholder:text-gray-400 rounded-[6px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-3.5 text-dark100_light900">
              <FormLabel>
                Username<span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your username"
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border placeholder:text-gray-400 rounded-[6px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="portfolioWebsite"
          render={({ field }) => (
            <FormItem className="space-y-3.5 text-dark100_light900">
              <FormLabel>Portfolio Link</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="Your portfolio URL"
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border placeholder:text-gray-400 rounded-[6px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="leetcodeId"
          render={({ field }) => (
            <FormItem className="space-y-3.5 text-dark100_light900">
              <FormLabel>Leetcode Username</FormLabel>
              <FormControl>
                <div className="flex gap-4 justify-center items-center">
                  <Input
                    type="text"
                    placeholder="Your leetcode username"
                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border placeholder:text-gray-400 rounded-[6px]"
                    disabled={parsedUser.leetcodeVerified}
                    {...field}
                  />
                  <div>
                    {!parsedUser.leetcodeVerified ? (
                      <Suspense fallback={<div>Loading...</div>}>
                        <ProfileVerificationDialog
                        clerkId={clerkId}
                        platform="leetcode"
                        userId={field.value}
                        onVerified={() => {
                          console.log("Verified successfully!");
                        }}
                      />
                      </Suspense>
                    ) : (
                      <Image
                        src={TrashIcon}
                        alt="Verified"
                        width={30}
                        height={30}
                        className="dark:invert cursor-pointer"
                        onClick={() => handleDelete("leetcode")}
                      />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="codeforcesId"
          render={({ field }) => (
            <FormItem className="space-y-3.5 text-dark100_light900">
              <FormLabel>Codeforces Username</FormLabel>
              <FormControl>
                <div className="flex gap-4 justify-center items-center">
                  <Input
                    type="text"
                    placeholder="Your codeforces username"
                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border placeholder:text-gray-400 rounded-[6px]"
                    disabled={parsedUser.codeforcesVerified}
                    {...field}
                  />
                  <div>
                    {!parsedUser.codeforcesVerified ? (
                      <Suspense fallback={<div>Loading...</div>}>
                        <ProfileVerificationDialog
                        clerkId={clerkId}
                        platform="codeforces"
                        userId={field.value}
                        onVerified={() => {
                          console.log("Verified successfully!");
                        }}
                      />
                      </Suspense>
                    ) : (
                      <Image
                        src={TrashIcon}
                        alt="Verified"
                        width={30}
                        height={30}
                        className="dark:invert cursor-pointer"
                        onClick={() => handleDelete("codeforces")}
                      />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="githubId"
          render={({ field }) => (
            <FormItem className="space-y-3.5 text-dark100_light900">
              <FormLabel>Github Username</FormLabel>
              <FormControl>
                <div className="flex gap-4 justify-center items-center">
                  <Input
                    type="text"
                    placeholder="Your github username"
                    className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border placeholder:text-gray-400 rounded-[6px]"
                    disabled={parsedUser.githubVerified}
                    {...field}
                  />
                  <div>
                    {!parsedUser.githubVerified ? (
                      <Suspense fallback={<div>Loading...</div>}>
                        <ProfileVerificationDialog
                        clerkId={clerkId}
                        platform="github"
                        userId={field.value}
                        onVerified={() => {
                          console.log("Verified successfully!");
                        }}
                      />
                      </Suspense>
                    ) : (
                      <Image
                        src={TrashIcon}
                        alt="Verified"
                        width={30}
                        height={30}
                        className="dark:invert cursor-pointer"
                        onClick={() => handleDelete("github")}
                      />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-3.5 text-dark100_light900">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Where are you from?"
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border placeholder:text-gray-400 rounded-[6px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3.5 text-dark100_light900">
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What's special about you?"
                  className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border placeholder:text-gray-400 rounded-[6px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-7 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit rounded-[5px] !text-light-900"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
    </Suspense>
  );
};

export default Profile;
