import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Flame,
  Zap,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  HelpCircle,
  ArrowRight,
  Code2,
  ChevronRight,
  Send,
  X,
  Trophy,
} from 'lucide-react';
import {
  LearningPath,
  LearningModule,
  QuizQuestion,
  UserProfile,
} from '../../types';
import { aiService } from '../../services/aiService';
import { FormattedMarkdown } from '../common/FormattedMarkdown';

interface QuestLearnPageProps {
  learningPaths: LearningPath[];
  user: UserProfile;
  onCompleteModule: (pathId: string, moduleId: string) => void;
  onAddXp: (amount: number, reason?: string) => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const QuestLearnPage: React.FC<QuestLearnPageProps> = ({
  learningPaths,
  user,
  onCompleteModule,
  onAddXp,
  onUnlockBadge,
}) => {
  const [selectedPathId, setSelectedPathId] = useState<string>(learningPaths[0]?.id || '');
  const [activeModule, setActiveModule] = useState<LearningModule | null>(null);

  // Quiz state
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // AI Tutor State
  const [aiTopicInput, setAiTopicInput] = useState('');
  const [aiAction, setAiAction] = useState<'explain' | 'example' | 'quiz' | 'study_plan'>('explain');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const currentPath =
    learningPaths.find((p) => p.id === selectedPathId) || learningPaths[0];

  const handleStartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizCompleted(false);
    setIsQuizModalOpen(true);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    const q = currentPath.quiz[currentQuestionIndex];
    if (selectedAnswer === q.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < currentPath.quiz.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished quiz! Award XP with accurate score
      const finalScore = score;
      setIsQuizCompleted(true);
      const earnedXp = finalScore * 30;
      onAddXp(earnedXp, `Kuis Evaluasi ${currentPath.title}`);

      // If perfect score, unlock Quiz Champion badge!
      if (finalScore === currentPath.quiz.length) {
        onUnlockBadge('b-quiz-champ');
      }
    }
  };

  const handleAskAiTutor = async (actionType: 'explain' | 'example' | 'quiz' | 'study_plan') => {
    const topicToQuery = aiTopicInput.trim() || currentPath.title;
    setAiAction(actionType);
    setAiLoading(true);
    setAiResponse(null);

    const res = await aiService.getQuestLearnExplanation(
      actionType,
      topicToQuery,
      `Modul sedang dipelajari: ${currentPath.title}`,
      user
    );
    setAiResponse(res.result);
    setAiLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. GAMIFICATION TOP BANNER */}
      <div className="bg-gradient-to-r from-[#163B70] via-[#1e4885] to-[#3978F6] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#163B70]/15 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-teal-200 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>QuestLearn Gamified Academy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Tingkatkan XP & Kuasai Mata Kuliahmu
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
              Belajar mandiri dengan kurikulum berbasis modul praktis, latihan kuis interaktif, dan pendampingan AI Tutor 24/7.
            </p>
          </div>

          {/* Gamification Stats */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shrink-0">
            <div className="flex items-center gap-2.5 pr-4 border-r border-white/15">
              <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-300">
                <Flame className="w-6 h-6 fill-orange-400 text-orange-400" />
              </div>
              <div>
                <div className="text-xl font-black text-orange-300">{user.streakDays} Hari</div>
                <div className="text-[10px] text-blue-200 uppercase font-bold">Daily Streak</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pl-2">
              <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300">
                <Zap className="w-6 h-6 fill-teal-300 text-teal-300" />
              </div>
              <div>
                <div className="text-xl font-black text-teal-300">{user.xp} XP</div>
                <div className="text-[10px] text-blue-200 uppercase font-bold">Level {user.level}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Ribbon */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-bold text-blue-200 flex items-center gap-1">
            <Award className="w-4 h-4 text-amber-300" />
            Badge Pencapaianmu:
          </span>
          {user.badges.map((b) => (
            <div
              key={b.id}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                b.unlockedAt
                  ? 'bg-white/20 text-white border-white/30 shadow-xs'
                  : 'bg-white/5 text-blue-300/60 border-white/10 opacity-70'
              }`}
              title={b.description}
            >
              <span>{b.icon}</span>
              <span>{b.name}</span>
              {b.unlockedAt && <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>}
            </div>
          ))}
        </div>
      </div>

      {/* 2. MAIN LEARNING ENVIRONMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLUMNS: Learning Paths & Active Module List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Path Selector */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Pilih Learning Path
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {learningPaths.map((path) => {
                const isSelected = path.id === currentPath.id;
                const percent = Math.round((path.completedModulesCount / path.totalModules) * 100);
                return (
                  <div
                    key={path.id}
                    onClick={() => setSelectedPathId(path.id)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#3978F6] bg-blue-50/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {path.level}
                      </span>
                      <span className="text-[#3978F6]">{percent}% Selesai</span>
                    </div>
                    <h3 className="font-extrabold text-xs text-slate-900 leading-snug line-clamp-2">
                      {path.title}
                    </h3>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                      <div
                        className="bg-[#3978F6] h-full rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Learning Path Content */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-[#3978F6] uppercase tracking-wide">
                  {currentPath.category}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {currentPath.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {currentPath.completedModulesCount} dari {currentPath.totalModules} modul terselesaikan
                  • Dapatkan hingga {currentPath.totalXp} XP!
                </p>
              </div>

              {/* Start Quiz Button */}
              {currentPath.quiz && currentPath.quiz.length > 0 && (
                <button
                  onClick={handleStartQuiz}
                  className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-[#23B5A5] hover:from-teal-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 self-start sm:self-auto shrink-0 transition-transform active:scale-95 cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-amber-200" />
                  <span>Uji Kuis ({currentPath.quiz.length} Soal)</span>
                </button>
              )}
            </div>

            {/* Modules List */}
            <div className="space-y-3">
              {currentPath.modules.map((mod, index) => {
                const isCompleted = mod.isCompleted;
                return (
                  <div
                    key={mod.id}
                    onClick={() => setActiveModule(mod)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start sm:items-center justify-between gap-4 group ${
                      isCompleted
                        ? 'bg-slate-50/70 border-slate-200/70 hover:bg-slate-100/80'
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-[#163B70] group-hover:bg-[#3978F6] group-hover:text-white transition-colors'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : index + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800 text-sm group-hover:text-[#163B70] transition-colors">
                            {mod.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{mod.description}</p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {mod.readTime}
                          </span>
                          <span className="text-teal-600 font-semibold flex items-center gap-0.5">
                            <Zap className="w-3 h-3 fill-teal-600" />
                            +{mod.xpReward} XP
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModule(mod);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 bg-slate-100 group-hover:bg-[#163B70] group-hover:text-white text-slate-700 transition-colors"
                    >
                      {isCompleted ? 'Pelajari Ulang' : 'Buka Modul'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT 1 COLUMN: AI Learning Assistant Widget */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-teal-100 text-teal-800 rounded-xl">
                <Sparkles className="w-4 h-4 text-[#23B5A5]" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">QuestLearn AI Tutor</h3>
                <p className="text-[11px] text-slate-500">Pendamping belajar interaktif berbasis Gemini</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                Punya pertanyaan atau konsep sulit?
              </label>
              <input
                type="text"
                value={aiTopicInput}
                onChange={(e) => setAiTopicInput(e.target.value)}
                placeholder="Contoh: Linked List, Big-O, Pointer..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#3978F6] focus:outline-none"
              />
            </div>

            {/* Quick Actions Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleAskAiTutor('explain')}
                disabled={aiLoading}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-left transition-colors flex items-center justify-between"
              >
                <span>🧠 Jelaskan Konsep</span>
              </button>
              <button
                onClick={() => handleAskAiTutor('example')}
                disabled={aiLoading}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-left transition-colors flex items-center justify-between"
              >
                <span>💻 Contoh Kasus</span>
              </button>
              <button
                onClick={() => handleAskAiTutor('quiz')}
                disabled={aiLoading}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-left transition-colors flex items-center justify-between"
              >
                <span>🎯 Latihan Soal</span>
              </button>
              <button
                onClick={() => handleAskAiTutor('study_plan')}
                disabled={aiLoading}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-left transition-colors flex items-center justify-between"
              >
                <span>📅 Rencana Belajar</span>
              </button>
            </div>

            {/* Loading */}
            {aiLoading && (
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-2 text-xs text-teal-800">
                <Sparkles className="w-4 h-4 text-[#23B5A5] animate-spin" />
                <span>AI Tutor sedang merumuskan penjelasan praktis...</span>
              </div>
            )}

            {/* AI Response Output */}
            {aiResponse && !aiLoading && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 max-h-72 overflow-y-auto leading-relaxed">
                <FormattedMarkdown content={aiResponse} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE MODULE READER MODAL */}
      {activeModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 max-h-[88vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#3978F6] uppercase">
                  {currentPath.title}
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg">{activeModule.title}</h3>
              </div>
              <button
                onClick={() => setActiveModule(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                <span>⏱️ Estimasi Waktu Baca: {activeModule.readTime}</span>
                <span className="font-bold text-[#3978F6]">Hadiah: +{activeModule.xpReward} XP</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeModule.content.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {activeModule.codeSnippet && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Code2 className="w-4 h-4 text-[#3978F6]" />
                    <span>Contoh Implementasi Kode:</span>
                  </div>
                  <pre className="p-4 bg-slate-900 text-teal-300 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
                    <code>{activeModule.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {activeModule.isCompleted ? 'Sudah terselesaikan' : 'Belum diselesaikan'}
              </span>

              <button
                onClick={() => {
                  onCompleteModule(currentPath.id, activeModule.id);
                  setActiveModule(null);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeModule.isCompleted
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    : 'bg-[#163B70] hover:bg-[#1f4a88] text-white shadow-md shadow-blue-950/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {activeModule.isCompleted ? 'Tandai Selesai Ulang' : `Selesaikan Modul (+${activeModule.xpReward} XP)`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. INTERACTIVE 5-QUESTION QUIZ MODAL */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-teal-50 to-blue-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-500 text-white rounded-xl">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Evaluasi Pemahaman Kuis</h3>
                  <p className="text-[11px] text-slate-500">
                    Pertanyaan {currentQuestionIndex + 1} dari {currentPath.quiz.length}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsQuizModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            {!isQuizCompleted ? (
              <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-5">
                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#23B5A5] h-full rounded-full transition-all"
                    style={{
                      width: `${((currentQuestionIndex + 1) / currentPath.quiz.length) * 100}%`,
                    }}
                  />
                </div>

                {/* Question */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-base leading-snug">
                    {currentPath.quiz[currentQuestionIndex].question}
                  </h4>
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentPath.quiz[currentQuestionIndex].options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === currentPath.quiz[currentQuestionIndex].correctAnswer;

                    let optionStyle = 'border-slate-200 hover:bg-slate-50';
                    if (isSelected && !isAnswerSubmitted) {
                      optionStyle = 'border-[#3978F6] bg-blue-50/70 text-[#163B70] font-semibold';
                    } else if (isAnswerSubmitted) {
                      if (isCorrect) {
                        optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Answer Feedback & Explanation */}
                {isAnswerSubmitted && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5 animate-in fade-in">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      💡 Pembahasan & Kunci:
                    </span>
                    <p className="leading-relaxed">
                      {currentPath.quiz[currentQuestionIndex].explanation}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Quiz Completion Summary */
              <div className="p-8 text-center space-y-4 my-auto">
                <div className="w-16 h-16 rounded-full bg-teal-100 text-[#23B5A5] flex items-center justify-center mx-auto shadow-inner">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="font-black text-xl text-slate-900">Kuis Selesai!</h3>
                <p className="text-sm text-slate-600">
                  Kamu menjawab benar{' '}
                  <span className="font-extrabold text-teal-600">{score}</span> dari{' '}
                  <span className="font-extrabold text-slate-800">{currentPath.quiz.length}</span> pertanyaan.
                </p>
                <div className="inline-block bg-teal-50 border border-teal-200 px-4 py-2 rounded-2xl text-xs font-bold text-teal-800">
                  ⚡ Bonus Diperoleh: +{score * 30} XP
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <span className="text-xs text-slate-500">Skor Sementaramu: {score}</span>

              {!isQuizCompleted ? (
                !isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="px-5 py-2 bg-[#163B70] disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    Kunci Jawaban
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2 bg-[#3978F6] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                  >
                    <span>Lanjut</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )
              ) : (
                <button
                  onClick={() => setIsQuizModalOpen(false)}
                  className="px-6 py-2.5 bg-[#163B70] text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Selesai & Tutup
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
