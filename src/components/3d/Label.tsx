import { Text } from '@react-three/drei';

interface LabelProps {
    text: string;
    position: [number, number, number];
    color: string;
    fontSize?: number;
    outlineWidth?: number;
    outlineColor?: string;
}

export function Label({
    text,
    position,
    color,
    fontSize = 0.5,
    outlineWidth = 0.04,
    outlineColor = "#0f172a"
}: LabelProps) {
    return (
        <Text
            position={position}
            fontSize={fontSize}
            color={color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={outlineWidth}
            outlineColor={outlineColor}
        >
            {text}
        </Text>
    );
}
