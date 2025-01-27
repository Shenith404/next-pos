import { X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '../button';
import { Input } from '../input';

interface ListInputBoxProps {
    name: string;
    inputList: string[];
    onChange: (event: { target: { name: string, value: string[] } }) => void;
    placeholder: string;
    errors?: string;
}

const ListInputBox = ({ name, inputList, onChange, placeholder, errors }: ListInputBoxProps) => {
    const [input, setInput] = useState<string>('');

    const handleKeyPress = useCallback(() => {
        if(input==='') return;
        if (onChange) {
            onChange({ target: { name, value: [...inputList, input] } });
        }
        setInput('');

    }, [input, inputList, onChange, name]);

    const handleRemove = useCallback((item: string) => {
        if (onChange) {
            onChange({ target: { name, value: inputList.filter(f => f !== item) } });
        }
    }, [inputList, onChange, name]);

    return (
        <div>
            <div className="flex items-center justify-center">
                <Input
                    type="text"
                    name={name}
                    value={input}
                    onChange={(e: any) => setInput(e.target.value)}
                    //    onKeyDown={handleKeyPress}
                    placeholder={placeholder}
                />
                <Button className="ml-2" onClick={handleKeyPress}>Add</Button>
            </div>
            {errors && <p className="text-red-600">{errors}</p>}
            <div className="flex items-center flex-wrap mt-3">
                {inputList.map((item, index) => (
                    <div key={index} className="bg-primary mb-2 flex items-center rounded-sm w-auto px-2 mx-1.5 text-background">
                        {item}
                        {(
                            <X
                                className="ml-2 w-4 h-4 cursor-pointer"
                                onClick={() => handleRemove(item)}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListInputBox;
