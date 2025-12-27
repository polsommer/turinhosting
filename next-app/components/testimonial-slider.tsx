"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "Turin cut our deployment time in half and the anomaly alerts helped us catch a noisy neighbor before it became an outage.",
    name: "Lea Grant",
    title: "VP Infrastructure, HelioStack"
  },
  {
    quote:
      "The cost estimator gave our finance team the confidence to greenlight new regions without surprise bills.",
    name: "Marco Ruiz",
    title: "CTO, AtlasForge"
  },
  {
    quote:
      "Smart insights and the assistant widget are like having a dedicated SRE on call for our platform team.",
    name: "Sana Boyd",
    title: "Head of Platform, Orbitlane"
  }
];

export function TestimonialSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonial = testimonials[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="grid gap-6 p-8 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Quote className="h-6 w-6" />
        </div>
        <div className="space-y-3">
          <p className="text-lg font-medium leading-relaxed">“{testimonial.quote}”</p>
          <div>
            <p className="text-sm font-semibold">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">{testimonial.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrev} aria-label="Previous testimonial">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext} aria-label="Next testimonial">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
