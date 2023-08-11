import React, { useEffect, useRef, useState } from 'react';

interface ISelection {
    text: string;
    start: number;
    end: number;
}

const DocumentHighlighter: React.FC<{ documentName?: string }> = ({ documentName = '1234P4588833_8888_Military Affidavit' }) => {
    const selectionRef = useRef<HTMLParagraphElement | null>(null);
    const [selections, setSelections] = useState<ISelection[]>([]);
    const [selectionHappening, setSelectionHappening] = useState<boolean>(false)
    const [processedName, setProcessedName] = useState<string[]>([documentName]);

    useEffect(() => {
        processName();
    }, [selections]);

    const selectionEventListener = () => {
        const selection = window.getSelection()!;
        if (selection?.toString() !== '') {
            const range = selection.getRangeAt(0);
            setSelections((prevSelections) => [
                ...prevSelections,
                { text: selection.toString(), start: range.startOffset, end: range.endOffset },
            ]);
        }
    };

    const deleteSelection = (index: number) => {
        const tempSelections = [...selections];
        tempSelections.splice(index, 1);
        setSelections(tempSelections);
    };

    const processName = () => {
        let processedDivs: any = [];
        let remainingText = documentName;

        selections.forEach((selection) => {
            const selectedText = remainingText.substring(selection.start, selection.end);
            const beforeSelected = remainingText.substring(0, selection.start);
            const afterSelected = remainingText.substring(selection.end);

            processedDivs.push(<>{beforeSelected}</>, <span className="selected">{selectedText}</span>);
            remainingText = afterSelected;
        });

        processedDivs.push(<>{remainingText}</>);

        setProcessedName(processedDivs);
    };

    return (
        <div>
            <p
                ref={selectionRef}
                className="text_selection_container"
                onMouseDown={() => setSelectionHappening(true)}
                onMouseUp={selectionEventListener}
            >
                {processedName}
            </p>
            <div>
                {selections.length > 0 && (
                    <div>
                        {selections.map((selection, index) => (
                            <p key={`sel_${index}`} onClick={() => deleteSelection(index)}>
                                {selection.text}
                                <select>
                                    <option value="Client account number">Client account number</option>
                                    <option value="Original account number">Original account number</option>
                                    <option value="Document Type">Document Type</option>
                                </select>
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentHighlighter;
