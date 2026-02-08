import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders as a div", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("applies default variant with shadow", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("shadow-card");
  });

  it("applies outlined variant with border", () => {
    const { container } = render(<Card variant="outlined">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("border");
  });

  it("applies elevated variant with larger shadow", () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("shadow-md");
  });

  it("applies flat variant without shadow or border", () => {
    const { container } = render(<Card variant="flat">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain("shadow-card");
    expect(card.className).not.toContain("border");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    const { container } = render(<Card className="my-card">Content</Card>);
    expect((container.firstChild as HTMLElement).className).toContain("my-card");
  });
});

describe("CardHeader", () => {
  it("renders children", () => {
    render(<CardHeader>Header</CardHeader>);
    expect(screen.getByText("Header")).toBeInTheDocument();
  });

  it("has padding", () => {
    const { container } = render(<CardHeader>H</CardHeader>);
    expect((container.firstChild as HTMLElement).className).toContain("p-6");
  });
});

describe("CardTitle", () => {
  it("renders as h3", () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });

  it("applies heading styles", () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByText("Title").className).toContain("font-semibold");
  });
});

describe("CardDescription", () => {
  it("renders description text", () => {
    render(<CardDescription>Description</CardDescription>);
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("applies muted text style", () => {
    render(<CardDescription>Desc</CardDescription>);
    expect(screen.getByText("Desc").className).toContain("text-foreground-muted");
  });
});

describe("CardContent", () => {
  it("renders children", () => {
    render(<CardContent>Body</CardContent>);
    expect(screen.getByText("Body")).toBeInTheDocument();
  });
});

describe("CardFooter", () => {
  it("renders children", () => {
    render(<CardFooter>Footer</CardFooter>);
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("uses flex layout", () => {
    const { container } = render(<CardFooter>F</CardFooter>);
    expect((container.firstChild as HTMLElement).className).toContain("flex");
  });
});

describe("Card composition", () => {
  it("renders full card with all sub-components", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Job Posting</CardTitle>
          <CardDescription>Create a new role</CardDescription>
        </CardHeader>
        <CardContent>Form goes here</CardContent>
        <CardFooter>Actions here</CardFooter>
      </Card>
    );

    expect(screen.getByRole("heading", { name: "Job Posting" })).toBeInTheDocument();
    expect(screen.getByText("Create a new role")).toBeInTheDocument();
    expect(screen.getByText("Form goes here")).toBeInTheDocument();
    expect(screen.getByText("Actions here")).toBeInTheDocument();
  });
});
