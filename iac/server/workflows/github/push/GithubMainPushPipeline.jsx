/** @jsxImportSource @levicape/fourtwo */
/** @jsxRuntime automatic */

import {
	GithubJobBuilder,
	GithubJobX,
	GithubNodePipelinePackageSteps,
	GithubPipelineX,
	GithubStepX,
} from "@levicape/fourtwo/ci/cd/pipeline/github";
import { CurrentState } from "@levicape/fourtwo/ci/cd/state";
import {
	GithubPipelineNodeScriptsX,
	GithubPipelineNodeSetupX,
} from "@levicape/fourtwo/ci/codegen/github";

const {
	current: { register, context: _$_ },
} = CurrentState;

export default (
	<GithubPipelineX
		name="#server on Push: CI"
		on={{
			push: {
				branches: ["main"],
			},
		}}
		env={{
			...register("NPM_REGISTRY_PROTOCOL", "https"),
			...register("NPM_REGISTRY_HOST", "npm.pkg.github.com"),
		}}
	>
		<GithubJobX
			id="build"
			name="Compile, Lint and Test package"
			runsOn={GithubJobBuilder.defaultRunsOn()}
			steps={
				
				<GithubPipelineNodeSetupX
					configuration={{
						packageManager: {
							node: "pnpm"
						},
						registry: {
							scope: "@levicape",
						},
						version: {
							node: "22.12.0",
						},
					}}
					options={{}}					
				>
					{(node) => {
						return (
							<>
								<GithubStepX
									name={"Compile module"}
									run={[
										// TODO: Add resumeFrom
										new GithubNodePipelinePackageSteps()
											.getScript(node.configuration)("-C packages/server compile")
											.build().run,
									]}
								/>
								<GithubPipelineNodeScriptsX {...node} scripts={["-C packages/server lint"]} />
								<GithubPipelineNodeScriptsX {...node} scripts={["-C packages/server test"]} />
							</>
						);
					}}
				</GithubPipelineNodeSetupX>				
			}
		/>
	</GithubPipelineX>
);