import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { FaLastfmSquare, FaPencilAlt } from 'react-icons/fa';

export interface ISelection {
    text: string;
    start: number;
    end: number;
}

const TextSelectionHook = () => {
    const [state, setState] = useState<any>([])
    const [documentName, setDocumentName] = useState<string>('')

    const selectionEventListener: any = () => {
        const selection = window.getSelection()!;
        if (selection?.toString() !== '') {
            const range = selection.getRangeAt(0);
            console.log(selection)
            setState((prevSelections: any) => [
                ...prevSelections,
                { text: selection.toString(), start: range.startOffset, end: range.endOffset },
            ]);
        }
    };

    const deleteSelection: any = (index: number) => {
        const tempSelections = [...state];
        tempSelections.splice(index, 1);
        setState(tempSelections);
    };

    const reset = () => {
        setState([])
        setDocumentName('')
    }

    return [
        state,
        documentName,
        {
            selectionEventListener,
            deleteSelection,
            reset,
            setDocumentName
        }
    ]
}

const TransformationNameModel = ({ onHide, show, setDocumentName, documentName }: { onHide: any, show: boolean, setDocumentName: any, documentName: string }) => {

    const [nameError, setNameError] = useState<boolean>(false);
    const [name, setName] = useState<string>('')

    const handleName = () => {
        if (name) {
            setDocumentName(name)
            onHide()
        } else {
            setNameError(true)
        }
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="lg"
            animation={true}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Transformation Name
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <div className="form_container">
                    <Col lg={12} sm={12} >
                        <Form className='mt-4'>
                            <Form.Group as={Col} className="mb-2">
                                <Col md={12} sm={12}>
                                    <Form.Control
                                        as="input"
                                        name="config_name"
                                        onChange={(e) => setName(e.target.value)}
                                        defaultValue={documentName}
                                        className="select_custom white">
                                    </Form.Control>
                                    <span style={{ color: 'red' }}><small>{nameError ? 'Document Name is Required' : ''}</small></span>
                                </Col>
                                <Form.Label className="label_custom">Name</Form.Label>
                            </Form.Group>
                        </Form>
                    </Col>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={() => handleName()}>Save</Button>
                <Button variant="dark" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal >
    )
}

const DocumentHighlighter = (
    {
        selections,
        selectEventListenerHook,
        documentName,
        setDocumentName
    }: {
        selectEventListenerHook: any,
        selections: ISelection[],
        documentName: string,
        setDocumentName: any
    }
) => {
    const [selectionHappening, setSelectionHappening] = useState<boolean>(false)
    const [processedName, setProcessedName] = useState<string[]>([]);
    const [showNameModal, setShowNameModal] = useState(false)

    useEffect(() => {
        processName();
    }, [selections]);

    useEffect(() => {
        setProcessedName([documentName])
    }, [documentName])

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
        <div style={{ position: 'relative', padding: '0 1rem' }}>
            {
                !documentName
                && <Col className='no_padding'>
                    Input the name to Transform
                    <Button style={{ textAlign: 'center' }} className='ml-5' variant="dark" onClick={() => setShowNameModal(true)}>Add</Button>
                </Col>
            }

            {
                documentName &&
                <>
                    <p style={{ marginBottom: '0', fontWeight: 'bold' }}>Please Highlight the sections</p>
                    <p
                        className="text_selection_container"
                        onMouseDown={() => setSelectionHappening(true)}
                        onMouseUp={selectEventListenerHook}
                    >
                        {processedName}
                    </p>
                    <FaPencilAlt size={20} onClick={() => setShowNameModal(true)} className='text_selection_main' />
                </>
            }

            {
                showNameModal &&
                <TransformationNameModel onHide={() => setShowNameModal(false)} show={showNameModal} setDocumentName={setDocumentName} documentName={documentName} />
            }
        </div>
    );
};

export { DocumentHighlighter, TextSelectionHook };
