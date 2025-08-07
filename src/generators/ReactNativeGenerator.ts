import { BaseGenerator } from "./BaseGenerator";
import { Language } from "../types/ProjectType";

export class ReactNativeGenerator extends BaseGenerator {
  async generate(projectPath: string, projectName: string, language: Language): Promise<void> {
    const ext = this.getFileExtension(language);
    
    // Create directories
    const directories = [
      "src",
      "src/components",
      "src/screens",
      "src/navigation",
      "src/services",
      "src/utils",
      "src/assets",
      "src/assets/images",
      "src/assets/icons",
      "android",
      "ios"
    ];
    
    await this.createDirectories(projectPath, directories);
    
    // Create files
    const files = {
      "App.js": this.getAppFile(),
      "index.js": this.getIndexFile(),
      "metro.config.js": this.getMetroConfig(),
      "babel.config.js": this.getBabelConfig(),
      "react-native.config.js": this.getReactNativeConfig(),
      "src/components/Header.js": this.getHeaderComponent(),
      "src/screens/HomeScreen.js": this.getHomeScreen(),
      "src/navigation/AppNavigator.js": this.getAppNavigator(),
      "src/services/api.js": this.getApiService(),
      "src/utils/helpers.js": this.getHelpers(),
      ".gitignore": this.getGitignore(),
      "README.md": this.getReadme(projectName, "A React Native project created with create-js-project."),
      "package.json": this.getPackageJson(projectName, this.getDependencies(), this.getScripts())
    };
    
    await this.createFiles(projectPath, files);
  }
  
  private getDependencies(): Record<string, string> {
    return {
      react: "18.2.0",
      "react-native": "0.72.6",
      "@react-navigation/native": "^6.1.9",
      "@react-navigation/stack": "^6.3.20",
      "react-native-gesture-handler": "^2.13.4",
      "react-native-reanimated": "^3.5.4",
      "react-native-safe-area-context": "^4.7.4",
      "react-native-screens": "^3.25.0",
    };
  }
  
  private getScripts(): Record<string, string> {
    return {
      android: "react-native run-android",
      ios: "react-native run-ios",
      start: "react-native start",
      test: "jest",
      lint: "eslint . --ext .js,.jsx,.ts,.tsx",
    };
  }
  
  private getAppFile(): string {
    return `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}`;
  }
  
  private getIndexFile(): string {
    return `import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);`;
  }
  
  private getMetroConfig(): string {
    return `const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig();
  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg']
    }
  };
})();`;
  }
  
  private getBabelConfig(): string {
    return `module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
  ],
};`;
  }
  
  private getReactNativeConfig(): string {
    return `module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts/'],
};`;
  }
  
  private getHeaderComponent(): string {
    return `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    padding: 15,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;`;
  }
  
  private getHomeScreen(): string {
    return `import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../components/Header';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header title="Home" />
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcome: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;`;
  }
  
  private getAppNavigator(): string {
    return `import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;`;
  }
  
  private getApiService(): string {
    return `const API_BASE_URL = 'https://api.example.com';

export const apiService = {
  async get(endpoint) {
    try {
      const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  async post(endpoint, data) {
    try {
      const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};`;
  }
  
  private getHelpers(): string {
    return `export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};`;
  }
  

  

  

}
