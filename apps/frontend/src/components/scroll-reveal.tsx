"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = ".motion-in";

export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js-reveal");

    const revealElement = (element: Element) => {
      element.classList.add("is-visible");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    const observeTargets = (scope: ParentNode = document) => {
      const targets = scope.querySelectorAll(REVEAL_SELECTOR);
      targets.forEach((target) => {
        if (target.classList.contains("is-visible")) {
          return;
        }
        observer.observe(target);
      });
    };

    observeTargets();

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) {
            return;
          }
          if (node.matches(REVEAL_SELECTOR) && !node.classList.contains("is-visible")) {
            observer.observe(node);
          }
          observeTargets(node);
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      root.classList.remove("js-reveal");
    };
  }, []);

  return null;
}

