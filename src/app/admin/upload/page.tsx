"use client";

import { useState } from 'react';
import Papa from 'papaparse';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface CsvRow {
    [key: string]: string;
}

export default function AdminUploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<CsvRow[]>([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            // Parse CSV for preview
            Papa.parse(selectedFile, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    // Show first 5 rows
                    setPreviewData((results.data as CsvRow[]).slice(0, 5));
                },
                error: (err: unknown) => {
                    const errorObj = err as { message: string };
                    setError('CSV 파싱 오류: ' + errorObj.message);
                }
            });
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('파일을 선택해주세요.');
            return;
        }

        setUploading(true);
        setMessage('업로드 중...');
        setError('');

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            // Normalize newlines to \n to handle mixed CRLF/LF
            const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

            Papa.parse(normalizedText, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    try {
                        const rows = results.data as CsvRow[];
                        console.log(`Parsed ${rows.length} rows from CSV.`);
                        let successCount = 0;
                        let failCount = 0;

                        // Process in batches of 50
                        const batchSize = 50;
                        for (let i = 0; i < rows.length; i += batchSize) {
                            const batch = rows.slice(i, i + batchSize);
                            const formattedBatch = batch.map((row: CsvRow) => {
                                // Map CSV columns to DB columns
                                // Using header names: id, qnum, topic, prompt, choices, answer_index, hint, explanation, difficulty_label, difficulty_level

                                // If ID is missing or invalid, generate one
                                const id = row.id && row.id.length > 10 ? row.id : uuidv4();

                                // Parse choices if it's a string
                                let choices = row.choices;
                                if (typeof choices === 'string') {
                                    try {
                                        // Remove extra quotes if present (CSV escaping)
                                        if (choices.startsWith('"') && choices.endsWith('"')) {
                                            choices = choices.substring(1, choices.length - 1).replace(/""/g, '"');
                                        }
                                        choices = JSON.parse(choices);
                                    } catch {
                                        console.warn('Choices parsing failed, using as is', choices);
                                    }
                                }

                                return {
                                    id: id,
                                    qnum: parseInt(row.qnum),
                                    topic: row.topic,
                                    prompt: row.prompt,
                                    choices: choices,
                                    answer_index: parseInt(row.answer_index),
                                    hint: row.hint,
                                    explanation: row.explanation,
                                    difficulty_label: row.difficulty_label,
                                    difficulty_level: parseInt(row.difficulty_level),
                                    created_at: new Date().toISOString(),
                                    updated_at: new Date().toISOString()
                                };
                            });

                            // Send to API route instead of direct Supabase call
                            const response = await fetch('/api/admin/upload', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ rows: formattedBatch }),
                            });

                            const result = await response.json();

                            if (!response.ok) {
                                console.error('Batch upload error:', result.error);
                                failCount += batch.length;
                                setError(`일부 배치 업로드 실패: ${result.error}`);
                            } else {
                                successCount += batch.length;
                            }

                            setMessage(`${Math.min(i + batchSize, rows.length)} / ${rows.length} 처리 중...`);
                        }

                        if (failCount > 0) {
                            setMessage(`완료! 성공: ${successCount}건, 실패: ${failCount}건. 에러 메시지를 확인하세요.`);
                        } else {
                            setMessage(`완료! 성공: ${successCount}건, 실패: ${failCount}건`);
                        }
                    } catch (err: unknown) {
                        const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
                        setError('업로드 중 오류 발생: ' + errorMessage);
                    } finally {
                        setUploading(false);
                    }
                },
                error: (err: unknown) => {
                    const errorObj = err as { message: string };
                    setError('CSV 파싱 오류: ' + errorObj.message);
                    setUploading(false);
                }
            });
        };
        reader.readAsText(file);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">퀴즈 데이터 업로드</h1>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        CSV 파일 선택 (generate_quizzes.ts 형식)
                    </label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
                    />
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
                        {message}
                    </div>
                )}

                {previewData.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">미리보기 (상위 5개)</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left">QNum</th>
                                        <th className="px-3 py-2 text-left">Topic</th>
                                        <th className="px-3 py-2 text-left">Prompt</th>
                                        <th className="px-3 py-2 text-left">Difficulty</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {previewData.map((row, idx) => (
                                        <tr key={idx}>
                                            <td className="px-3 py-2">{row.qnum}</td>
                                            <td className="px-3 py-2">{row.topic}</td>
                                            <td className="px-3 py-2 truncate max-w-xs">{row.prompt}</td>
                                            <td className="px-3 py-2">{row.difficulty_label}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className={`px-6 py-2 rounded-md text-white font-medium
              ${!file || uploading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {uploading ? '업로드 중...' : 'DB에 업로드'}
                    </button>
                </div>
            </div>
        </div>
    );
}
