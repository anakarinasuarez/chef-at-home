"use client";

import Button from "@/components/Button";
import { colors } from "@/design-system";

export default function TestButtonsPage() {
  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: colors.interface.background.primary }}
    >
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold mb-8"
          style={{ color: colors.interface.text.primary }}
        >
          Button Component Test
        </h1>

        <div className="space-y-8">
          {/* Primary Buttons */}
          <div>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: colors.interface.text.primary }}
            >
              Primary Buttons (Row 1 - Normal, Row 2 - Hover)
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <Button variant="primary">Example</Button>
              <Button variant="primary">+ Example</Button>
              <Button variant="primary">Example +</Button>
            </div>
          </div>

          {/* Secondary Buttons */}
          <div>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: colors.interface.text.primary }}
            >
              Secondary Buttons (Row 3 - Normal, Row 4 - Hover)
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <Button variant="secondary">Example</Button>
              <Button variant="secondary">+ Example</Button>
              <Button variant="secondary">Example +</Button>
            </div>
          </div>

          {/* Tertiary Buttons */}
          <div>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: colors.interface.text.primary }}
            >
              Tertiary Buttons (Row 5 - Normal, Row 6 - Hover)
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <Button variant="tertiary">Example</Button>
              <Button variant="tertiary">+ Example</Button>
              <Button variant="tertiary">Example +</Button>
            </div>
          </div>

          {/* Size Variants */}
          <div>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: colors.interface.text.primary }}
            >
              Size Variants
            </h2>
            <div className="flex gap-4 items-center">
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="md">
                Medium
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
            </div>
          </div>

          {/* Disabled States */}
          <div>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: colors.interface.text.primary }}
            >
              Disabled States
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <Button variant="primary" disabled>
                Primary Disabled
              </Button>
              <Button variant="secondary" disabled>
                Secondary Disabled
              </Button>
              <Button variant="tertiary" disabled>
                Tertiary Disabled
              </Button>
            </div>
          </div>

          {/* Full Width */}
          <div>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: colors.interface.text.primary }}
            >
              Full Width Buttons
            </h2>
            <div className="space-y-4">
              <Button variant="primary" fullWidth>
                Full Width Primary
              </Button>
              <Button variant="secondary" fullWidth>
                Full Width Secondary
              </Button>
              <Button variant="tertiary" fullWidth>
                Full Width Tertiary
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
