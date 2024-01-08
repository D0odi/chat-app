import { View, Text, TouchableOpacity } from "react-native";
import { useAuthRequest } from "expo-auth-session";
import { useEffect } from "react";
import { SPOTIFY_CLIENT_ID } from "@env";

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export default Home = () => {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: SPOTIFY_CLIENT_ID,
      scopes: [
        "user-read-email",
        "user-library-read",
        "user-read-playback-state",
        "user-read-currently-playing",
      ],
      usePKCE: false,
      redirectUri: "exp://localhost:8081/--/spotify-auth-callback",
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      console.log(response);
    }
  }, [response]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity
        onPress={() => {
          promptAsync();
        }}
      >
        <Text>{SPOTIFY_CLIENT_ID}</Text>
      </TouchableOpacity>
    </View>
  );
};
