import { Home } from "lucide-react"
import Link from "next/link"


export default function AboutPage() {
    return (
        <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>

            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <Home size={20} color="#3b82f6" />
                Home
            </Link>

            <h1>About Block Puzzle</h1>

            <p>
                Block Puzzle is a classic drag-and-drop puzzle game designed for
                relaxing gameplay and improving logical thinking.
            </p>

            <p>
                The goal is simple: drag shapes onto the board and complete full rows
                or columns to clear them and score points.
            </p>

            <p>
                This website is operated by Aida Games.
            </p>

            <p>
                Contact: aidavetisyan93@gmail.com
            </p>
        </main>
    );
}