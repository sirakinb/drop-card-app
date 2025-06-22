import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

export default function NavigationDots({
  data = [],
  currentIndex = 0,
  onDotPress,
  color = '#FFFFFF',
}) {
  // Enhanced data validation and error handling
  let dots = [];
  
  if (Array.isArray(data)) {
    dots = data;
  } else if (data && typeof data === 'object' && data.length !== undefined) {
    // Handle array-like objects
    dots = Array.from(data);
  } else {
    console.warn('NavigationDots: data prop is not an array or array-like object:', typeof data, data);
    return null;
  }
  
  if (dots.length === 0) {
    console.warn('NavigationDots: no data items to display');
    return null;
  }

  // Ensure currentIndex is within bounds
  const safeCurrentIndex = Math.max(0, Math.min(currentIndex, dots.length - 1));

  return (
    <View style={styles.container}>
      {dots.map((_, index) => {
        const isActive = index === safeCurrentIndex;
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              isActive ? styles.activeDot : styles.inactiveDot,
              {
                backgroundColor: isActive 
                  ? color 
                  : color === '#FFFFFF' 
                    ? 'rgba(255, 255, 255, 0.4)' 
                    : 'rgba(0, 0, 0, 0.4)'
              }
            ]}
            onPress={() => {
              if (onDotPress && typeof onDotPress === 'function') {
                onDotPress(index);
              } else {
                console.warn('NavigationDots: onDotPress is not a function');
              }
            }}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel={`Go to slide ${index + 1} of ${dots.length}`}
            accessibilityRole="button"
          />
        );
      })}
    </View>
  );
}

NavigationDots.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  currentIndex: PropTypes.number,
  onDotPress: PropTypes.func,
  color: PropTypes.string
};

NavigationDots.defaultProps = {
  data: [],
  currentIndex: 0,
  color: '#FFFFFF',
  onDotPress: null
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  activeDot: {
    width: 24,
    borderRadius: 12,
  },
  inactiveDot: {
  },
}); 