"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const SwipeButtonCircle = ({ Icon, opacity, panHandlers, translateX, height, borderRadius, circleBackgroundColor }) => {
    return (react_1.default.createElement(react_native_1.Animated.View, Object.assign({ testID: "Button" }, panHandlers, { style: [
            styles.iconContainer,
            {
                opacity,
                width: height,
                height,
                borderRadius,
                transform: [{ translateX }],
            },
        ] }),
        react_1.default.createElement(react_native_1.Animated.View, { testID: "IconContainer", style: [
                styles.innerIconContainer,
                {
                    backgroundColor: circleBackgroundColor,
                    width: height,
                    height,
                    borderRadius,
                },
                { opacity },
            ] }, Icon)));
};
exports.default = SwipeButtonCircle;
const styles = react_native_1.StyleSheet.create({
    iconContainer: {
        position: 'absolute',
        backgroundColor: '#e9ff6b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
