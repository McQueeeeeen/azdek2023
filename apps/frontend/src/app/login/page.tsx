import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("login_sign_up_azure_clean", "Azure Clean auth");

export default function LoginPage() {
  return <StitchPage folder="login_sign_up_azure_clean" />;
}

