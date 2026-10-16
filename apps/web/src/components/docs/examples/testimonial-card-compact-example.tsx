import { TestimonialCard } from "@/registry/blobz/components/testimonial-card";

export function TestimonialCardCompactExample() {
	return (
		<TestimonialCard
			attribution="Product team · Example company"
			avatar={{ name: "Maya", palette: ["#f4e8ff", "#b881eb"] }}
			className="w-full max-w-sm"
			name="Example customer"
			quote="“A little character goes a long way. Even an empty profile feels considered.”"
			variant="compact"
		/>
	);
}
