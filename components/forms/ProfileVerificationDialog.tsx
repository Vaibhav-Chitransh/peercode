/* eslint-disable tailwindcss/classnames-order */
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { generateVerificationToken } from "@/lib/utils";
import {
  verifyLeetcodeProfile,
  verifyCodeforcesProfile,
  updateUser,
  verifyGithubProfile,
} from "@/lib/actions/user.action";
import { toast } from "@/hooks/use-toast";

interface Props {
  clerkId: string;
  userId: string | undefined;
  onVerified: () => void;
  platform: "leetcode" | "codeforces" | "github";
}

const ProfileVerificationDialog: React.FC<Props> = ({
  clerkId,
  userId,
  onVerified,
  platform,
}) => {
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<
    "pending" | "success" | "failed"
  >("pending");

  useEffect(() => {
    setToken(generateVerificationToken());
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    toast({
      title: "Token Copied",
      description: "Paste this in your profile's About or Name section.",
      className: "bg-blue-100 text-blue-900 border border-blue-400",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (!userId) {
      toast({
        title: "Missing Username",
        description: "Username is not provided",
        className: "bg-red-100 text-red-900 border border-red-400",
      });
      return;
    }

    setLoading(true);
    try {
      let result = false;
      if (platform === "leetcode") {
        result = await verifyLeetcodeProfile(userId, token);
      } else if (platform === "codeforces") {
        result = await verifyCodeforcesProfile(userId, token);
      } else if (platform === "github") {
        result = await verifyGithubProfile(userId, token);
      }

      if (result) {
        await updateUser({
          clerkId,
          updateData: {
            [`${platform}Verified`]: true,
          },
          path: "",
        });
        setVerificationResult("success");
        toast({
          title: "Verification Successful",
          description: `Your ${platform} profile has been verified.`,
          className: "bg-green-100 text-green-900 border border-green-400",
        });
        onVerified();
      } else {
        setVerificationResult("failed");
        toast({
          title: "Verification Failed",
          description: `Could not find token in your ${platform} profile.`,
          className: "bg-red-100 text-red-900 border border-red-400",
        });
      }
    } catch (err) {
      console.error("Verification error:", err);
      setVerificationResult("failed");
      toast({
        title: "Error Verifying Profile",
        description: "Something went wrong. Try again later.",
        className: "bg-red-100 text-red-900 border border-red-400",
      });
    } finally {
      setLoading(false);
    }
  };

  const instructions =
    platform === "leetcode"
      ? `Paste the token in the "Name" or "About Me" section of your LeetCode profile, then click Save.`
      : platform === "github"
        ? `Paste the token in the "Name" or "Bio" section of your GitHub profile, then click Save.`
        : `Paste the token in the "First Name" or "Last Name" field of your Codeforces profile and save it.`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-400 rounded-[6px] transition-transform duration-300 hover:scale-95">
          Verify Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] text-dark100_light900 bg-white dark:bg-slate-950">
        <DialogHeader>
          <DialogTitle>
            Verify Your{" "}
            {platform === "leetcode"
              ? "LeetCode"
              : platform === "codeforces"
                ? "Codeforces"
                : "GitHub"}{" "}
            Profile
          </DialogTitle>
          <DialogDescription>
            To verify your identity, follow the instructions below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{instructions}</p>

          <div className="flex items-center gap-2">
            <Input
              value={token}
              readOnly
              className="font-mono border border-gray-400 rounded-[6px]"
            />
            <Button variant="outline" size="icon" onClick={handleCopy}>
              <Copy className="size-4" />
            </Button>
            {copied && <span className="text-xs text-green-600">Copied!</span>}
          </div>

          {verificationResult === "failed" && (
            <p className="text-sm text-red-600">
              ❌ Verification failed. Please make sure the token is saved
              correctly in your profile.
            </p>
          )}
          {verificationResult === "success" && (
            <p className="text-sm text-green-600">✅ Verified successfully!</p>
          )}
        </div>

        {verificationResult !== "success" && (
          <DialogFooter className="mt-4">
            <Button
              onClick={handleVerify}
              disabled={loading}
              className="bg-green-500 hover:bg-green-400 rounded-[4px]"
            >
              {loading ? "Verifying..." : "Check Now"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileVerificationDialog;
