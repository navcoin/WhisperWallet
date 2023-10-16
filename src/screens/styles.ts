import { StyleService } from '@tsejerome/ui-kitten-components';
import { s } from 'react-native-size-matters';
import { screenWidth } from '@utils';

export const onboardingStyles = StyleService.create({
    button: { flex: 1, marginBottom: s(16) },
    onboardingList: { flex: 1, marginLeft: 16 },
    container: {
        flex: 1,
        paddingLeft: s(16),
    },
    content: {
        paddingRight: s(60),
        paddingLeft: s(16),
    },
    bottomView: {
        paddingBottom: s(16),
        flexDirection: 'row',
        paddingLeft: s(32),
        paddingRight: s(24),
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: s(0),
        marginBottom: s(16),
        justifyContent: 'flex-end',
        width: screenWidth,
        flex: 1,
    },
    dot: {
        marginRight: s(46),
    },
    animated: {
        flexDirection: 'row',
        paddingLeft: s(16),
    },
});
