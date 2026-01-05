import ScoreBadge from "./ScoreBadge";
import ScoreGauge from "./ScoreGauge";

const Category = ({ title, score }: { title: string; score: number }) => {
	let textColor =
		score > 70
			? "text-green-600"
			: score > 49
				? "text-yellow-600"
				: "text-red-600";

	return (
		<div className="resume-summary">
			<div className="category text-xl">
				<div className="flex flex-row gap-2 items-center justify-center">
					<p>{title}</p>
					<ScoreBadge score={score} />
				</div>
				<p>
					<span className={textColor}>{score}</span>/100
				</p>
			</div>
		</div>
	);
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
	return (
		<div className="bg-white rounded-2xl shadow-md w-full">
			<div className="flex flex-row items-center p-4 sm:gap-8 gap-4">
				<ScoreGauge score={feedback.overallScore} />

				<div className="flex flex-col sm:gap-2 gap-1">
					<h2 className="text-2xl leading-6 font-bold">Your Resume Score</h2>
					<p className="text-gray-500 text-sm leading-4">
						This score is calculated based on the variable listed below.
					</p>
				</div>
			</div>
			<Category title="Tone & Style" score={feedback.toneAndStyle.score} />
			<Category title="Content" score={feedback.content.score} />
			<Category title="Structure" score={feedback.structure.score} />
			<Category title="Skills" score={feedback.skills.score} />
		</div>
	);
};

export default Summary;
