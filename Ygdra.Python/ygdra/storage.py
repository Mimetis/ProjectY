class YStorage:

    def __init__(self, storage_name: str) -> None:
        """
        YStorage constructor.

        Parameters
        ----------
        storage_name : str
            Storage name.
        """

        self.storage_name = storage_name

    def get_path(self, container: str, path: str) -> str:
        """
        Get full data lake storage path.

        Parameters
        ----------
        container : str
            Storage container.
        path: str
            Storage relative path.
        """
        if not container:
            raise ValueError('container input value is null or empty')
        if not path:
            raise ValueError('path input value is null or empty')

        return f"abfss://{container}@{self.storage_name}.dfs.core.windows.net/{path}"
