/**
 * Job Form Section Components
 *
 * These components implement the job posting form sections based on the Figma designs.
 * They compose existing UI components (RichTextEditor, SegmentedController, Select, etc.)
 * to create cohesive form sections.
 *
 * Usage:
 * ```tsx
 * import {
 *   RoleInformationSection,
 *   EducationRequirementsSection,
 *   WorkplaceInformationSection,
 *   CompensationBenefitsSection,
 * } from "@/components/jobs";
 *
 * function JobPostingForm() {
 *   return (
 *     <form className="space-y-6">
 *       <RoleInformationSection
 *         roleDescription={roleDescription}
 *         onRoleDescriptionChange={setRoleDescription}
 *         // ...other props
 *       />
 *       <EducationRequirementsSection
 *         educationLevel={educationLevel}
 *         onEducationLevelChange={setEducationLevel}
 *         // ...other props
 *       />
 *       <WorkplaceInformationSection
 *         workplaceType={workplaceType}
 *         onWorkplaceTypeChange={setWorkplaceType}
 *         // ...other props
 *       />
 *       <CompensationBenefitsSection
 *         compensation={compensation}
 *         onCompensationChange={setCompensation}
 *         // ...other props
 *       />
 *     </form>
 *   );
 * }
 * ```
 */

export {
  RoleInformationSection,
  RichTextEditorWithCounter,
  type RoleInformationSectionProps,
} from "./RoleInformationSection";

export {
  EducationRequirementsSection,
  educationLevelOptions,
  type EducationRequirementsSectionProps,
  type EducationLevel,
} from "./EducationRequirementsSection";

export {
  WorkplaceInformationSection,
  usStates,
  countries,
  type WorkplaceInformationSectionProps,
  type WorkplaceType,
  type WorkplaceLocation,
} from "./WorkplaceInformationSection";

export {
  CompensationBenefitsSection,
  payTypeOptions,
  payFrequencyOptions,
  type CompensationBenefitsSectionProps,
  type CompensationData,
  type PayType,
  type PayFrequency,
} from "./CompensationBenefitsSection";
