import { redirect } from "next/navigation";

// Landing page redirects to first step (privacy notice)
export default function NewApplicationPage() {
    redirect("/dashboard/new-application/privacy-notice");
}
