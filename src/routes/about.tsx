import { createFileRoute } from "@tanstack/react-router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="min-h-screen py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Text Column */}
          <div className="flex-1 space-y-5 text-base text-foreground leading-relaxed">
            <h1 className="font-display text-4xl font-bold tracking-tight mb-8">
              About the Creator
            </h1>

            <p>I'm Aarit.</p>
            <p>
              I built this because I wanted to make a game where you can box an AI with your webcam.
            </p>
            <p>
              I tried building it once already. I mostly leaned on AI to write the code. It worked
              for a while, then the whole project turned into a pile of code I didn't understand.
              Every change broke something else. After a few weeks, I gave up.
            </p>
            <p>That bugged me more than the game itself.</p>
            <p>
              My brother (the handsome guy on the left in the second picture) builds stuff with AI
              too, but his projects don't fall apart like mine. I kept asking myself why.
            </p>
            <p>
              Then I went on vacation with him, and I figured it out. He knows what's going on under
              the hood. I don't. If AI writes something weird, he can spot it. I usually can't. I
              was using AI to replace understanding instead of helping it along.
            </p>
            <p>That was enough to change my plan.</p>
            <p>
              Instead of trying to build the game again, I decided to build the course I wish I had
              the first time. If I can explain each piece well enough for someone else to learn it,
              I'll probably understand it well enough to build the game without creating another
              mess.
            </p>
            <p>If this course helps other people make their own games, that's even better.</p>
            <p>
              My goal is still the same as it was on day one. I still want to step in front of my
              webcam and box an AI. I'm just taking the longer road to get there because I think
              it'll end up being the shorter one.
            </p>
            <p>
              Hope this isn't the last thing I build🤞. (Besides, I already have a list of projects
              I want to make after this one.)
            </p>
            <p>
              If you want to reach me, send me an email at{" "}
              <a
                href="mailto:perswalaarit@gmail.com"
                className="text-primary hover:underline font-semibold"
              >
                perswalaarit@gmail.com
              </a>
              .
            </p>
            <p className="pt-4 text-sm text-muted-foreground">
              PS.: Yes, I took all those background pictures myself cuz im tuff like that.
            </p>
            <p className="text-sm text-muted-foreground">
              PSS: Thanks for reading all this. In fact, I have a present for you...but I need you
              to click the logo in the top left 5 times quickly to get it.
            </p>
          </div>

          {/* Carousel Column */}
          <div className="w-full md:w-[400px] lg:w-[450px] shrink-0 sticky top-24">
            <div className="glass-panel rounded-2xl p-2 shadow-xl">
              <Carousel className="w-full">
                <CarouselContent>
                  <CarouselItem>
                    <div className="aspect-[3/4] overflow-hidden rounded-xl relative">
                      <img
                        src="/aboutaarit.jpg"
                        alt="Aarit"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="aspect-[3/4] overflow-hidden rounded-xl relative">
                      <img
                        src="/meandbro.JPG"
                        alt="Aarit and his brother"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="left-4 opacity-70 hover:opacity-100 bg-background/80 backdrop-blur" />
                <CarouselNext className="right-4 opacity-70 hover:opacity-100 bg-background/80 backdrop-blur" />
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
