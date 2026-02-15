import Link from "next/link";
import {Home} from "lucide-react";

export default function PrivacyPage() {
    return (
        <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>

            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <Home size={20} color="#3b82f6" />
                Home
            </Link>
            <h1>Privacy Policy</h1>

            <p>
                This website may use third-party services such as Google AdSense
                to display advertisements.
            </p>

            <p>
                Google and other partners may use cookies to personalize ads
                based on your visit to this website and other sites on the internet.
            </p>

            <p>
                Users may opt out of personalized advertising by visiting
                Google Ads Settings.
            </p>

            <p>
                We do not collect personal data directly.
            </p>

            <p>
                Contact email: aida.avetisyan93@gmail.com
            </p>
        </main>
    );
}