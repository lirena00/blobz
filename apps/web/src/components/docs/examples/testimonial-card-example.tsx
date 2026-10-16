import { TestimonialCard } from "@/registry/blobz/components/testimonial-card";

export function TestimonialCardExample() {
	return (
		<TestimonialCard
			attribution="Design team · Example company"
			avatar={{ name: "Avery", palette: ["#fff0e2", "#fa9769"] }}
			className="w-full max-w-2xl"
			name="Example customer"
			quote="“Thoughtful defaults make the small details feel effortless.”"
		/>
	);
}
