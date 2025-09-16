import { render, screen } from "@testing-library/react";
import OptimizedImage from "../OptimizedImage";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock ImagePlaceholder
vi.mock("../ImagePlaceholder", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="image-placeholder">{title}</div>
  ),
}));

describe("OptimizedImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders OpenAI DALL-E image correctly", () => {
    const dallEUrl =
      "https://oaidalleapiprodscus.blob.core.windows.net/test-image.jpg";

    render(
      <OptimizedImage
        src={dallEUrl}
        alt="Test DALL-E Image"
        width={400}
        height={300}
      />
    );

    const image = screen.getByAltText("Test DALL-E Image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", dallEUrl);
  });

  it("renders local image correctly", () => {
    const localUrl = "/images/test.jpg";

    render(
      <OptimizedImage
        src={localUrl}
        alt="Test Local Image"
        width={400}
        height={300}
      />
    );

    const image = screen.getByAltText("Test Local Image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", localUrl);
  });

  it("shows placeholder when image fails to load", () => {
    const invalidUrl = "https://invalid-domain.com/image.jpg";

    render(
      <OptimizedImage
        src={invalidUrl}
        alt="Test Failed Image"
        width={400}
        height={300}
      />
    );

    // Simular error de carga
    const image = screen.getByAltText("Test Failed Image");
    image.dispatchEvent(new Event("error"));

    // Debería mostrar el placeholder
    expect(screen.getByTestId("image-placeholder")).toBeInTheDocument();
  });

  it("applies correct props for DALL-E images", () => {
    const dallEUrl =
      "https://oaidalleapiprodscus.blob.core.windows.net/test-image.jpg";

    render(
      <OptimizedImage
        src={dallEUrl}
        alt="Test DALL-E Image"
        width={400}
        height={300}
        quality={80}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );

    const image = screen.getByAltText("Test DALL-E Image");
    expect(image).toHaveAttribute("width", "400");
    expect(image).toHaveAttribute("height", "300");
  });

  it("handles fill prop correctly", () => {
    const dallEUrl =
      "https://oaidalleapiprodscus.blob.core.windows.net/test-image.jpg";

    render(
      <OptimizedImage
        src={dallEUrl}
        alt="Test Fill Image"
        fill
        className="test-class"
      />
    );

    const image = screen.getByAltText("Test Fill Image");
    expect(image).toHaveClass("test-class");
  });
});
