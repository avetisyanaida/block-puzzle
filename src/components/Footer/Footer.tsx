import Link from "next/link";

export const Footer = () => {
    return (
        <footer className={'footer'}>
            <Link style={{color: 'white'}} href="/about">About</Link>
            <Link style={{color: "white"}} href="/privacy">Privacy Policy</Link>
        </footer>
    )
}