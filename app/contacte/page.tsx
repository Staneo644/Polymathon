"use client";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faEuro } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { YellowButton } from "@/components/button";

export default function Option() {
    return (
        <div className="flex flex-col justify-evenly h-full">
            <div className="flex justify-between mx-10 items-center">

        <Link href="https://discord.gg/vfx8VVRV" passHref className="font-bold font-serif italic">
            Rejoindre notre discord
      </Link>
      <YellowButton onClick={() => window.open("https://discord.gg/vfx8VVRV")} className="rounded-md px-2.5">

        <FontAwesomeIcon icon={faDiscord} className="h-5"/>
      </YellowButton>
            </div>
        <div className="flex justify-between items-center mx-10">

      <a href="mailto:polymathon@proton.me" className="font-bold font-serif italic">
            Nous envoyer un mail
      </a>
      <YellowButton onClick={() => window.open("mailto:polymathon@proton.me")} className="rounded-md">
        <FontAwesomeIcon icon={faEnvelope} className="h-5"/>
      </YellowButton>
        </div>
      <div className="flex justify-between mx-10 items-center">

<Link href="https://discord.gg/votre-lien-discord" passHref className="font-bold font-serif italic">
      Nous donner de l'argent
</Link>
<YellowButton onClick={() => window.open("https://discord.gg/vfx8VVRV")} className="rounded-md">
<FontAwesomeIcon icon={faEuro} className="h-5"/>
</YellowButton>
        </div>
        <div className="flex justify-between mx-10 items-center">

<Link href="https://discord.gg/votre-lien-discord" passHref className="font-bold font-serif italic">
      Nous laisser un commentaire
</Link>
<YellowButton onClick={() => window.open("https://discord.gg/vfx8VVRV")} className="rounded-md px-2.5">
 
<FontAwesomeIcon icon={faComment} className="h-5"/>
</YellowButton>
        </div>
        </div>
    );
    }
    